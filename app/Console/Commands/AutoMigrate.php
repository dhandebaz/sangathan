<?php

namespace App\Console\Commands;

use App\Services\MigrationService;
use Illuminate\Console\Command;

class AutoMigrate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:auto {--force : Force migration even if no pending migrations detected}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically run pending migrations safely';

    /**
     * Execute the console command.
     */
    public function handle(MigrationService $migrationService)
    {
        $this->info('Checking for pending migrations...');

        try {
            $result = $migrationService->runPendingMigrations();

            if ($result) {
                $this->info('✓ Automatic migration completed successfully.');
                return Command::SUCCESS;
            } else {
                $this->warn('No pending migrations found or migration failed.');
                return Command::SUCCESS;
            }

        } catch (\Exception $e) {
            $this->error('Migration failed: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}