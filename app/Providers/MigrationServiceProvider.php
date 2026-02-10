<?php

namespace App\Providers;

use App\Services\MigrationService;
use Illuminate\Support\ServiceProvider;

class MigrationServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(MigrationService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(MigrationService $migrationService): void
    {
        // Only run automatic migrations in production or if explicitly enabled
        if ($this->shouldRunAutoMigration()) {
            try {
                $migrationService->runPendingMigrations();
            } catch (\Exception $e) {
                // Log the error but don't crash the application
                \Log::warning('Automatic migration check failed: ' . $e->getMessage());
            }
        }
    }

    /**
     * Determine if automatic migration should run.
     *
     * @return bool
     */
    private function shouldRunAutoMigration(): bool
    {
        // Don't run in console unless explicitly enabled
        if ($this->app->runningInConsole() && !config('app.auto_migrate_in_console', false)) {
            return false;
        }

        // Check if application is installed
        if (!app(\App\Services\InstallationService::class)->isInstalled()) {
            return false;
        }

        // Check if auto migration is enabled (enabled by default in production)
        if (config('app.auto_migrate', app()->environment('production'))) {
            return true;
        }

        return false;
    }
}