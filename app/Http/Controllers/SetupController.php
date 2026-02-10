<?php

namespace App\Http\Controllers;

use App\Services\InstallationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Artisan;
use Exception;

class SetupController extends Controller
{
    protected InstallationService $installationService;

    public function __construct(InstallationService $installationService)
    {
        $this->installationService = $installationService;
    }

    /**
     * Show setup welcome page.
     *
     * @return \Illuminate\View\View
     */
    public function welcome()
    {
        return view('setup.welcome');
    }

    /**
     * Show system requirements page.
     *
     * @return \Illuminate\View\View
     */
    public function requirements()
    {
        $requirements = $this->checkRequirements();
        
        return view('setup.requirements', compact('requirements'));
    }

    /**
     * Show database configuration form.
     *
     * @return \Illuminate\View\View
     */
    public function database()
    {
        return view('setup.database');
    }

    /**
     * Process database configuration.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeDatabase(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'db_host' => 'required|string|max:255',
            'db_port' => 'required|integer|between:1,65535',
            'db_name' => 'required|string|max:64|regex:/^[a-zA-Z0-9_]+$/',
            'db_username' => 'required|string|max:255',
            'db_password' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            // Validate database credentials
            $this->installationService->validateDatabaseCredentials([
                'host' => $request->db_host,
                'port' => $request->db_port,
                'database' => $request->db_name,
                'username' => $request->db_username,
                'password' => $request->db_password,
            ]);

            // Store database credentials in session for next step
            session([
                'setup.db_host' => $request->db_host,
                'setup.db_port' => $request->db_port,
                'setup.db_name' => $request->db_name,
                'setup.db_username' => $request->db_username,
                'setup.db_password' => $request->db_password,
            ]);

            return redirect()->route('setup.application');
            
        } catch (Exception $e) {
            return redirect()->back()
                ->with('error', 'Database connection failed: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Show application configuration form.
     *
     * @return \Illuminate\View\View
     */
    public function application()
    {
        if (!session()->has('setup.db_host')) {
            return redirect()->route('setup.database');
        }

        return view('setup.application');
    }

    /**
     * Process application configuration.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeApplication(Request $request)
    {
        if (!session()->has('setup.db_host')) {
            return redirect()->route('setup.database');
        }

        $validator = Validator::make($request->all(), [
            'app_name' => 'required|string|max:255',
            'admin_email' => 'required|email|max:255',
            'admin_password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            // Store application data in session
            session([
                'setup.app_name' => $request->app_name,
                'setup.admin_email' => $request->admin_email,
                'setup.admin_password' => $request->admin_password,
            ]);

            return redirect()->route('setup.install');
            
        } catch (Exception $e) {
            return redirect()->back()
                ->with('error', 'An error occurred: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Show installation progress page.
     *
     * @return \Illuminate\View\View
     */
    public function install()
    {
        if (!session()->has('setup.app_name')) {
            return redirect()->route('setup.application');
        }

        return view('setup.install');
    }

    /**
     * Process the actual installation.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function processInstall()
    {
        if (!session()->has('setup.app_name')) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid installation session'
            ], 400);
        }

        try {
            // Step 1: Update .env file with database credentials
            $this->updateEnvironmentFile();

            // Step 2: Generate application key
            $this->installationService->generateAppKey();

            // Step 3: Run migrations
            $this->installationService->runMigrations();

            // Step 4: Seed initial data
            $this->installationService->seedInitialData([
                'app_name' => session('setup.app_name'),
                'email' => session('setup.admin_email'),
                'password' => session('setup.admin_password'),
            ]);

            // Step 5: Mark as installed
            $this->installationService->markAsInstalled();

            // Step 6: Clear session data
            session()->forget('setup');

            return response()->json([
                'success' => true,
                'message' => 'Installation completed successfully',
                'redirect' => route('setup.complete')
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Installation failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show installation complete page.
     *
     * @return \Illuminate\View\View
     */
    public function complete()
    {
        if (!$this->installationService->isInstalled()) {
            return redirect()->route('setup.welcome');
        }

        return view('setup.complete');
    }

    /**
     * Update environment file with configuration.
     *
     * @return void
     * @throws Exception
     */
    private function updateEnvironmentFile(): void
    {
        $envData = [
            'DB_CONNECTION' => 'mysql',
            'DB_HOST' => session('setup.db_host'),
            'DB_PORT' => session('setup.db_port'),
            'DB_DATABASE' => session('setup.db_name'),
            'DB_USERNAME' => session('setup.db_username'),
            'DB_PASSWORD' => session('setup.db_password'),
            'APP_NAME' => '"' . session('setup.app_name') . '"',
            'APP_URL' => url(''),
        ];

        $this->installationService->updateEnvFile($envData);
    }

    /**
     * Check system requirements.
     *
     * @return array
     */
    private function checkRequirements(): array
    {
        return [
            'php_version' => [
                'required' => '8.1.0',
                'current' => PHP_VERSION,
                'passed' => version_compare(PHP_VERSION, '8.1.0', '>=')
            ],
            'pdo_mysql' => [
                'required' => true,
                'current' => extension_loaded('pdo_mysql'),
                'passed' => extension_loaded('pdo_mysql')
            ],
            'openssl' => [
                'required' => true,
                'current' => extension_loaded('openssl'),
                'passed' => extension_loaded('openssl')
            ],
            'mbstring' => [
                'required' => true,
                'current' => extension_loaded('mbstring'),
                'passed' => extension_loaded('mbstring')
            ],
            'tokenizer' => [
                'required' => true,
                'current' => extension_loaded('tokenizer'),
                'passed' => extension_loaded('tokenizer')
            ],
            'xml' => [
                'required' => true,
                'current' => extension_loaded('xml'),
                'passed' => extension_loaded('xml')
            ],
            'json' => [
                'required' => true,
                'current' => extension_loaded('json'),
                'passed' => extension_loaded('json')
            ],
            'curl' => [
                'required' => true,
                'current' => extension_loaded('curl'),
                'passed' => extension_loaded('curl')
            ],
            'gd' => [
                'required' => true,
                'current' => extension_loaded('gd'),
                'passed' => extension_loaded('gd')
            ],
            'fileinfo' => [
                'required' => true,
                'current' => extension_loaded('fileinfo'),
                'passed' => extension_loaded('fileinfo')
            ],
            'storage_writable' => [
                'required' => true,
                'current' => is_writable(storage_path()),
                'passed' => is_writable(storage_path())
            ],
            'bootstrap_cache_writable' => [
                'required' => true,
                'current' => is_writable(base_path('bootstrap/cache')),
                'passed' => is_writable(base_path('bootstrap/cache'))
            ],
        ];
    }
}