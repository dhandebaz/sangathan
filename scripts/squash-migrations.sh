#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# squash-migrations.sh
#
# Squashes old Supabase migration files into a single baseline migration.
# Run this when the migration count grows large (>50 files) or the oldest
# migrations are >6 months old and never modified.
#
# Usage:
#   ./scripts/squash-migrations.sh --date 2026-01-01        # squash everything before this date
#   ./scripts/squash-migrations.sh --since 202402_000000     # squash everything before this migration prefix
#   ./scripts/squash-migrations.sh --keep-last 20            # keep the 20 most recent, squash the rest
#   ./scripts/squash-migrations.sh --date 2026-01-01 --dry-run  # preview without making changes
#
# Requirements:
#   - supabase CLI (v1.0+) installed and authenticated
#   - A running local Supabase stack (supabase start)
#   - Clean git working tree (no uncommitted migration changes)
# =============================================================================

MIGRATIONS_DIR="supabase/migrations"
DRY_RUN=false
CUTOFF_DATE=""
CUTOFF_PREFIX=""
KEEP_LAST=0

# ---- Color helpers (disabled in dry-run mode for clean pipes) ----
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

info()    { echo -e "${CYAN}[INFO]${NC} $*"; }
ok()      { echo -e "${GREEN}[OK]${NC}   $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }

cleanup() {
    if [ "$DRY_RUN" = false ]; then
        rm -f /tmp/sq_mig_squash_*.sql 2>/dev/null || true
    fi
}
trap cleanup EXIT

# ---- Parse arguments ----
usage() {
    cat <<EOF
Usage: $0 [--date YYYY-MM-DD | --since MIGRATION_PREFIX | --keep-last N] [--dry-run]

Options:
  --date YYYY-MM-DD      Squash all migrations created before this date.
                           The date is matched against the YYYYMMDDHHMMSS prefix.
  --since NAME           Squash all migrations that sort before NAME.
                           NAME is matched as a prefix (e.g. "20260218" or "202602180001").
  --keep-last N          Keep the N most recent migrations, squash everything else.
  --dry-run              Print what would be done without touching files.
  -h, --help             Show this help message.

Examples:
  $0 --date 2026-06-01
  $0 --since 202602180001_admin_infra
  $0 --keep-last 15
  $0 --date 2026-01-01 --dry-run
EOF
    exit 0
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --date)
            CUTOFF_DATE="$2"
            shift 2
            ;;
        --since)
            CUTOFF_PREFIX="$2"
            shift 2
            ;;
        --keep-last)
            KEEP_LAST="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            error "Unknown option: $1"
            usage
            ;;
    esac
done

# ---- Validate arguments ----
if [ -n "$CUTOFF_DATE" ] && [ -n "$CUTOFF_PREFIX" ]; then
    error "Use --date OR --since, not both."
    exit 1
fi

if [ -n "$CUTOFF_DATE" ] && [ "$KEEP_LAST" -gt 0 ]; then
    error "Use --date OR --keep-last, not both."
    exit 1
fi

if [ -n "$CUTOFF_PREFIX" ] && [ "$KEEP_LAST" -gt 0 ]; then
    error "Use --since OR --keep-last, not both."
    exit 1
fi

if [ -z "$CUTOFF_DATE" ] && [ -z "$CUTOFF_PREFIX" ] && [ "$KEEP_LAST" -eq 0 ]; then
    error "Specify --date, --since, or --keep-last."
    exit 1
fi

# ---- Verify requirements ----
if [ ! -d "$MIGRATIONS_DIR" ]; then
    error "Migrations directory not found: $MIGRATIONS_DIR"
    error "Run this script from the project root (one level above supabase/)."
    exit 1
fi

if ! command -v supabase &>/dev/null; then
    error "supabase CLI is not installed or not in PATH."
    exit 1
fi

if ! git rev-parse --git-dir &>/dev/null; then
    warn "Not a git repository. Proceed with caution (no rollback safety)."
fi

# ---- Gather migration files ----
mapfile -t ALL_MIGRATIONS < <(ls "$MIGRATIONS_DIR"/*.sql | sort)
TOTAL="${#ALL_MIGRATIONS[@]}"

if [ "$TOTAL" -eq 0 ]; then
    error "No migration files found in $MIGRATIONS_DIR."
    exit 1
fi

info "Found $TOTAL migration files."

# ---- Determine the cutoff index ----
CUTOFF_INDEX=-1

if [ -n "$CUTOFF_DATE" ]; then
    # Convert date to YYYYMMDDHHMMSS prefix (using 000000 for time)
    CUTOFF_TS=$(date -d "$CUTOFF_DATE" +%Y%m%d000000 2>/dev/null || date -j -f "%Y-%m-%d" "$CUTOFF_DATE" +%Y%m%d000000 2>/dev/null)
    if [ -z "$CUTOFF_TS" ]; then
        error "Invalid date format: $CUTOFF_DATE (use YYYY-MM-DD)"
        exit 1
    fi

    for i in "${!ALL_MIGRATIONS[@]}"; do
        fname=$(basename "${ALL_MIGRATIONS[$i]}")
        fname_prefix="${fname:0:14}"
        if [[ "$fname_prefix" < "$CUTOFF_TS" ]]; then
            CUTOFF_INDEX=$i
        fi
    done
    info "Cutoff date: $CUTOFF_DATE (timestamp prefix: $CUTOFF_TS)"
fi

if [ -n "$CUTOFF_PREFIX" ]; then
    # Strip _description if present, get the timestamp portion
    PREFIX="${CUTOFF_PREFIX%%_*}"
    for i in "${!ALL_MIGRATIONS[@]}"; do
        fname=$(basename "${ALL_MIGRATIONS[$i]}")
        fname_prefix="${fname:0:${#PREFIX}}"
        if [[ "$fname_prefix" < "$PREFIX" ]] || [[ "$fname_prefix" == "$PREFIX" ]]; then
            CUTOFF_INDEX=$i
        fi
    done
    info "Cutoff prefix: $CUTOFF_PREFIX"
fi

if [ "$KEEP_LAST" -gt 0 ]; then
    if [ "$KEEP_LAST" -ge "$TOTAL" ]; then
        error "Keeping $KEEP_LAST migrations out of $TOTAL -- nothing to squash."
        exit 1
    fi
    CUTOFF_INDEX=$((TOTAL - KEEP_LAST - 1))
    info "Keeping $KEEP_LAST most recent migrations."
fi

if [ "$CUTOFF_INDEX" -lt 0 ]; then
    error "No migrations matched the cutoff. Nothing to squash."
    exit 1
fi

SQUASH_COUNT=$((CUTOFF_INDEX + 1))
KEEP_COUNT=$((TOTAL - SQUASH_COUNT))

SQUASHED_FILES=("${ALL_MIGRATIONS[@]:0:$SQUASH_COUNT}")
KEPT_FILES=("${ALL_MIGRATIONS[@]:$SQUASH_COUNT:$KEEP_COUNT}")

LAST_SQUASHED=$(basename "${SQUASHED_FILES[$((SQUASH_COUNT - 1))]}")
FIRST_KEPT=$(basename "${KEPT_FILES[0]:-none}")

# ---- Summary ----
echo ""
info "============================================"
info " Squash Plan"
info "============================================"
info " Total migrations:         $TOTAL"
info " To squash ($SQUASH_COUNT):           oldest -> $LAST_SQUASHED"
info " To keep ($KEEP_COUNT):              ${FIRST_KEPT:-none} -> newest"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo ""
    info "=== DRY-RUN MODE: No changes will be made ==="
    echo ""
    info "Files to DELETE:"
    for f in "${SQUASHED_FILES[@]}"; do
        echo "  - $(basename "$f")"
    done
    echo ""
    info "Files to KEEP:"
    for f in "${KEPT_FILES[@]}"; do
        echo "  - $(basename "$f")"
    done
    echo ""
    info "Next steps (when you run without --dry-run):"
    info "  1. A new baseline migration will be created: supabase/migrations/<TS>_squashed_baseline.sql"
    info "  2. The $SQUASH_COUNT old files listed above will be removed"
    info "  3. Run: supabase db reset"
    info "  4. Run: supabase db dump --local > /tmp/verify_schema.sql"
    info "  5. Verify, then git commit"
    exit 0
fi

# ---- Confirm ----
warn "This will DELETE $SQUASH_COUNT migration files and replace them with one baseline."
warn "This operation is DESTRUCTIVE. Did you commit or stash any pending changes?"
read -r -p "Proceed with squash? (type 'yes' to confirm): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    info "Aborted."
    exit 0
fi

# ---- Step 1: Dump the current schema into a temporary file ----
info "Step 1/4: Dumping current schema from local database..."

DUMP_FILE="/tmp/sq_mig_squash_$$.sql"
supabase db dump --local --file "$DUMP_FILE" 2>/dev/null

if [ ! -s "$DUMP_FILE" ]; then
    error "Schema dump is empty or failed. Is supabase local DB running?"
    exit 1
fi

# Strip the "supabase_migrations" schema from the dump -- we do not want to
# capture migration tracking tables in the baseline. We also strip the
# pgcrypto extension creation (it belongs in a separate setup, not the baseline).
TMP_CLEAN="/tmp/sq_mig_squash_clean_$$.sql"
# Filter out lines that reference supabase_migrations schema
grep -v "supabase_migrations" "$DUMP_FILE" > "$TMP_CLEAN"

# ---- Step 2: Generate the new baseline timestamp ----
BASELINE_TS=$(date +%Y%m%d%H%M%S)
BASELINE_FILE="${MIGRATIONS_DIR}/${BASELINE_TS}_squashed_baseline.sql"

# ---- Step 3: Build the baseline file with header ----
info "Step 2/4: Creating baseline migration: $(basename "$BASELINE_FILE")"

{
    echo "-- Squashed baseline migration"
    echo "-- Replaces $SQUASH_COUNT migration files from $(basename "${SQUASHED_FILES[0]}") through $LAST_SQUASHED"
    echo "-- Created: $(date +%Y-%m-%d)"
    echo "--"
    echo "-- To regenerate this baseline with newer migrations included,"
    echo "-- delete this file, restore the individual files from git, and re-run this script."
    echo ""
    cat "$TMP_CLEAN"
} > "$BASELINE_FILE"

echo "" >> "$BASELINE_FILE"

rm -f "$DUMP_FILE" "$TMP_CLEAN"

# ---- Step 4: Remove old migration files ----
info "Step 3/4: Removing $SQUASH_COUNT old migration files..."

for f in "${SQUASHED_FILES[@]}"; do
    rm -v "$f"
done

# ---- Step 5: Final instructions ----
echo ""
info "Step 4/4: Verification"
echo ""
ok "Squash complete!"
echo ""
info "============================================"
info " MANUAL VERIFICATION REQUIRED"
info "============================================"
echo ""
info "1. Reset your local database and verify the schema:"
info "   supabase db reset"
info "   supabase db dump --local > /tmp/verify_schema.sql"
info "   diff /tmp/sq_mig_squash_*.sql /tmp/verify_schema.sql  # should match"
echo ""
info "2. Start the local stack and run your test suite:"
info "   supabase start"
info "   npm run test"
echo ""
info "3. Commit the changes:"
info "   git add supabase/migrations/"
info "   git commit -m 'chore: squash $SQUASH_COUNT migrations into baseline ($(basename "${SQUASHED_FILES[0]}") through $LAST_SQUASHED)'"
echo ""
info "4. Notify the team that migration files were squashed."
info "   Anyone with a feature branch should rebase onto main after this merge."
echo ""
info "=== DONE ==="
