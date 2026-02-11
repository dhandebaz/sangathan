<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class VerifyDeployment extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'deploy:verify';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verify deployment readiness for cPanel';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Verifying deployment readiness for cPanel...');
        $this->newLine();

        // Check for required files
        $requiredFiles = [
            '.cpanel.yml',
            'public/css/app.css',
            'public/js/app.js',
            'vendor/autoload.php',
        ];

        $missingFiles = [];
        foreach ($requiredFiles as $file) {
            if (!File::exists(base_path($file))) {
                $missingFiles[] = $file;
            }
        }

        if (empty($missingFiles)) {
            $this->info('✓ All required files are present');
        } else {
            $this->error('✗ Missing required files:');
            foreach ($missingFiles as $file) {
                $this->error("  - $file");
            }
        }

        // Check .cpanel.yml
        if (File::exists(base_path('.cpanel.yml'))) {
            $this->info('✓ .cpanel.yml file exists');
        } else {
            $this->error('✗ .cpanel.yml file is missing');
        }

        // Check for pre-built assets
        if (File::exists(public_path('css/app.css'))) {
            $size = File::size(public_path('css/app.css'));
            $this->info("✓ CSS file exists ({$size} bytes)");
        } else {
            $this->error('✗ CSS file is missing from public directory');
        }

        // Check .gitignore
        if (File::exists(base_path('.gitignore'))) {
            $content = File::get(base_path('.gitignore'));
            if (str_contains($content, '/storage/logs/*') && str_contains($content, '.env')) {
                $this->info('✓ .gitignore properly configured');
            } else {
                $this->warn('⚠ .gitignore may need additional entries');
            }
        }

        // Check migrations
        $migrationFiles = File::files(database_path('migrations'));
        $this->info('✓ Found ' . count($migrationFiles) . ' migration files');

        // Check routes
        if (File::exists(base_path('routes/web.php'))) {
            $this->info('✓ Web routes file exists');
        }

        $this->newLine();
        $this->info('Deployment verification complete!');
        
        return Command::SUCCESS;
    }
}