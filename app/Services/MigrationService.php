<?php

namespace App\Services;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class MigrationService
{
    /**
     * Check and run pending migrations automatically.
     *
     * @return bool
     */
    public function runPendingMigrations(): bool
    {
        try {
            // Check if application is installed
            if (!$this->isApplicationInstalled()) {
                return false;
            }

            // Check if there are pending migrations
            if (!$this->hasPendingMigrations()) {
                return true;
            }

            // Run migrations in safe mode
            Artisan::call('migrate', [
                '--force' => true,
                '--step' => true, // Run migrations one by one for safety
            ]);

            // Log successful migration
            $this->logMigration('Automatic migration completed successfully');

            return true;

        } catch (\Exception $e) {
            // Log migration failure (without sensitive data)
            $this->logMigration('Automatic migration failed: ' . $e->getMessage(), 'error');
            
            // Don't throw exception - let application continue running
            // The admin will be notified through other means
            return false;
        }
    }

    /**
     * Check if application is installed and ready for migrations.
     *
     * @return bool
     */
    private function isApplicationInstalled(): bool
    {
        // Check if lock file exists
        if (File::exists(storage_path('installed'))) {
            return true;
        }

        // Check if .env has APP_INSTALLED=true
        if (env('APP_INSTALLED', false)) {
            return true;
        }

        return false;
    }

    /**
     * Check if there are pending migrations.
     *
     * @return bool
     */
    private function hasPendingMigrations(): bool
    {
        try {
            // Get pending migrations
            Artisan::call('migrate:status', [
                '--pending' => true,
            ]);

            $output = Artisan::output();
            
            // Check if there are pending migrations
            return str_contains($output, 'Pending') || str_contains($output, 'Not Run');
            
        } catch (\Exception $e) {
            // If we can't check, assume there might be pending migrations
            return true;
        }
    }

    /**
     * Get migration status for admin dashboard.
     *
     * @return array
     */
    public function getMigrationStatus(): array
    {
        try {
            Artisan::call('migrate:status');
            $output = Artisan::output();

            // Parse the output to get migration status
            $lines = explode("\n", $output);
            $migrations = [];

            foreach ($lines as $line) {
                if (preg_match('/^\s*(\d+)\s+(.+?)\s+(Not Run|Pending|Ran)\s*$/', $line, $matches)) {
                    $migrations[] = [
                        'batch' => $matches[1],
                        'migration' => $matches[2],
                        'status' => $matches[3],
                    ];
                }
            }

            return [
                'has_pending' => $this->hasPendingMigrations(),
                'migrations' => $migrations,
                'last_run' => $this->getLastMigrationTime(),
            ];

        } catch (\Exception $e) {
            return [
                'has_pending' => false,
                'migrations' => [],
                'last_run' => null,
                'error' => 'Unable to check migration status',
            ];
        }
    }

    /**
     * Get last migration run time.
     *
     * @return string|null
     */
    private function getLastMigrationTime(): ?string
    {
        try {
            $migrationFile = database_path('migrations/.gitignore');
            if (File::exists($migrationFile)) {
                return date('Y-m-d H:i:s', File::lastModified($migrationFile));
            }
        } catch (\Exception $e) {
            // Silently handle errors
        }

        return null;
    }

    /**
     * Log migration events (without sensitive data).
     *
     * @param string $message
     * @param string $level
     * @return void
     */
    private function logMigration(string $message, string $level = 'info'): void
    {
        // Use a separate log file for migrations
        $logMessage = sprintf(
            "[%s] %s\n",
            now()->format('Y-m-d H:i:s'),
            $message
        );

        $logFile = storage_path('logs/migrations.log');
        
        try {
            File::append($logFile, $logMessage);
        } catch (\Exception $e) {
            // If we can't write to the log file, use Laravel's default logger
            Log::$level($message);
        }
    }

    /**
     * Manually trigger migration check (for admin use).
     *
     * @return array
     */
    public function manualMigrationCheck(): array
    {
        $result = [
            'success' => false,
            'message' => '',
            'has_pending' => false,
            'migrations_run' => 0,
        ];

        try {
            $status = $this->getMigrationStatus();
            $result['has_pending'] = $status['has_pending'];

            if (!$status['has_pending']) {
                $result['success'] = true;
                $result['message'] = 'No pending migrations found.';
                return $result;
            }

            // Run migrations
            $output = Artisan::call('migrate', [
                '--force' => true,
                '--step' => true,
            ]);

            $result['success'] = true;
            $result['message'] = 'Migrations completed successfully.';
            $result['migrations_run'] = $output;

            $this->logMigration('Manual migration check completed successfully');

        } catch (\Exception $e) {
            $result['message'] = 'Migration failed: ' . $e->getMessage();
            $this->logMigration('Manual migration check failed: ' . $e->getMessage(), 'error');
        }

        return $result;
    }
}