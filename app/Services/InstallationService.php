<?php

namespace App\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class InstallationService
{
    /**
     * Check if the application is installed.
     *
     * @return bool
     */
    public function isInstalled(): bool
    {
        // Check if lock file exists
        if (File::exists(config('installation.lock_file'))) {
            return true;
        }

        // Check if .env file has APP_INSTALLED=true
        if (env('APP_INSTALLED', false)) {
            return true;
        }

        // Check if we can connect to database and check installation status
        try {
            if ($this->canConnectToDatabase() && $this->isDatabaseInstalled()) {
                return true;
            }
        } catch (\Exception $e) {
            // Database connection failed, assume not installed
            return false;
        }

        return false;
    }

    /**
     * Mark the application as installed.
     *
     * @return void
     */
    public function markAsInstalled(): void
    {
        // Create lock file
        File::put(config('installation.lock_file'), date('Y-m-d H:i:s'));
        
        // Update .env file
        $this->updateEnvFile(['APP_INSTALLED' => 'true']);
    }

    /**
     * Check if we can connect to the database.
     *
     * @return bool
     */
    public function canConnectToDatabase(): bool
    {
        try {
            DB::connection()->getPdo();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Check if database is properly installed.
     *
     * @return bool
     */
    public function isDatabaseInstalled(): bool
    {
        try {
            // Check if users table exists (indicates basic installation)
            return Schema::hasTable('users');
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Update .env file with given key-value pairs.
     *
     * @param array $data
     * @return void
     */
    public function updateEnvFile(array $data): void
    {
        $envPath = base_path('.env');
        
        if (!File::exists($envPath)) {
            File::copy(base_path('.env.example'), $envPath);
        }

        $envContent = File::get($envPath);
        
        foreach ($data as $key => $value) {
            $pattern = "/^{$key}=.*/m";
            $replacement = "{$key}={$value}";
            
            if (preg_match($pattern, $envContent)) {
                $envContent = preg_replace($pattern, $replacement, $envContent);
            } else {
                $envContent .= "\n{$replacement}";
            }
        }

        File::put($envPath, $envContent);
    }

    /**
     * Validate database credentials.
     *
     * @param array $credentials
     * @return bool
     * @throws \Exception
     */
    public function validateDatabaseCredentials(array $credentials): bool
    {
        try {
            // Temporarily set database config
            config([
                'database.connections.mysql.host' => $credentials['host'],
                'database.connections.mysql.port' => $credentials['port'] ?? 3306,
                'database.connections.mysql.database' => $credentials['database'],
                'database.connections.mysql.username' => $credentials['username'],
                'database.connections.mysql.password' => $credentials['password'],
            ]);

            // Test connection
            DB::connection('mysql')->getPdo();
            
            return true;
        } catch (\Exception $e) {
            throw new \Exception('Invalid database credentials: ' . $e->getMessage());
        }
    }

    /**
     * Run database migrations.
     *
     * @return void
     * @throws \Exception
     */
    public function runMigrations(): void
    {
        try {
            Artisan::call('migrate', [
                '--force' => true,
                '--seed' => false,
            ]);
        } catch (\Exception $e) {
            throw new \Exception('Migration failed: ' . $e->getMessage());
        }
    }

    /**
     * Seed initial data.
     *
     * @param array $adminData
     * @return void
     * @throws \Exception
     */
    public function seedInitialData(array $adminData): void
    {
        try {
            // Create admin user
            $user = \App\Models\User::create([
                'name' => 'System Administrator',
                'email' => $adminData['email'],
                'password' => bcrypt($adminData['password']),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]);

            // Create default settings
            $this->createDefaultSettings($adminData['app_name'] ?? config('installation.setup.default_app_name'));
            
        } catch (\Exception $e) {
            throw new \Exception('Seeding failed: ' . $e->getMessage());
        }
    }

    /**
     * Create default system settings.
     *
     * @param string $appName
     * @return void
     */
    private function createDefaultSettings(string $appName): void
    {
        // Settings will be stored in database when settings table is created
        // For now, we just ensure the app name is set
        config(['app.name' => $appName]);
    }

    /**
     * Generate Laravel application key.
     *
     * @return void
     * @throws \Exception
     */
    public function generateAppKey(): void
    {
        try {
            Artisan::call('key:generate', ['--force' => true]);
        } catch (\Exception $e) {
            throw new \Exception('Key generation failed: ' . $e->getMessage());
        }
    }
}