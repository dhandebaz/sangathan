# SEO Guides — Article Writing Guide (for contributing authors/agents)

Read `types.ts` first. Every article must satisfy the validation test in
`tests/seo-articles.test.ts` (lengths, counts, banned phrases).

## Voice: human, Indian, practical

- Write like a senior NGO consultant explaining things over chai. Concrete,
  specific, warm. Vary sentence length. Short punchy lines are fine.
- Use Indian specifics everywhere: ₹ amounts, real portal names
  (ngodarpan.gov.in, rtionline.gov.in, incometax.gov.in, mca.gov.in),
  real laws with years (Societies Registration Act 1860, Indian Trusts Act
  1882, Companies Act 2013 Section 8, RTI Act 2005, FCRA 2010, Income Tax
  Act 12A/80G), real timelines ("4-8 weeks", "30 days").
- One small grounded anecdote per article is good ("A Jaipur education trust
  we know..."). Mark illustrative examples as illustrative — NEVER invent
  fake statistics, fake case studies, fake quotes from real people, or fake
  government circulars.
- Address the reader as "you". Prefer active voice.

## Banned (validation will fail the build)

- AI clichés: delve, landscape (as in "NGO landscape"), game-changer,
  unlock, supercharge, elevate, "in today's fast-paced world",
  "look no further", "nestled", "tapestry", "vibrant". No emojis anywhere.
- False claims: `501c3`, `instant 80G`, `automatic 80G`, `guaranteed`
  (registration/approval/funding), `15-day RTI` (the PIO reply period is
  30 days — always say 30 days + first appeal).
- Retired product modes: never present student unions, workers unions or
  RWAs as Sangathan organisation types. Informational mentions of real-world
  trade unions / resident groups are fine, but no product claims about them.

## Honesty rules (project law)

- 80G: only call something an 80G receipt when the organisation holds its
  own 80G registration. Otherwise say "80G-ready".
- RTI: 30-day PIO reply period, first appeal after that. No auto-filing
  claims.
- BQF: community affiliation/recognition, never legal protection or immunity.
- Sangathan capabilities you may reference (only these, only truthfully):
  donation records with 80G-ready receipts, statutory member registers,
  secret-ballot voting, complaint diary with 30-day RTI reminder, printable
  parcha studio, public transparency page, member ID cards, Excel/CSV member
  import, meeting minutes records.

## Structure (every article)

1. First block = lede paragraph answering the query in 2-3 sentences.
2. `keyTakeaways`: 3-5 crisp answers (these feed AI-search citations).
3. Body: >= 2 `h2` sections, conversational `h3`s allowed, one `list` or
   `numbered` per major section. At least ONE `figure` and (in most
   articles) ONE `table` comparing options, costs, timelines or documents.
4. `note` boxes for warnings beginners always miss (deadlines, wrong-portal
   mistakes, stamp-duty surprises).
5. `faqs`: 4-6 questions phrased exactly like Google/voice searches
   ("Do I need...?", "How long does... take?", "What happens if...?").
   Answers 40-90 words, self-contained.
6. `productTieIn`: omit unless there is a genuinely natural fit.

## SEO mechanics

- Title: primary keyword near the front, <= 70 chars, with a year or a
  concrete hook where natural: "(2026)", "Checklist", "Format", "Step-by-Step".
- Description: 120-170 chars, contains the primary keyword + one benefit.
- Keywords: 4-8, mix of head + long-tail ("80g receipt format", "donation
  receipt format for ngo india pdf").
- Target 700-1000 words of real substance. No filler intros ("In the
  ever-evolving world of..."). Start answering immediately.
