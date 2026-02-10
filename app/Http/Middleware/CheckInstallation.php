<?php

namespace App\Http\Middleware;

use App\Services\InstallationService;
use Closure;
use Illuminate\Http\Request;

class CheckInstallation
{
    protected InstallationService $installationService;

    public function __construct(InstallationService $installationService)
    {
        $this->installationService = $installationService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if the application is installed
        $isInstalled = $this->installationService->isInstalled();

        // If not installed and not on setup routes, redirect to setup
        if (!$isInstalled && !$this->isSetupRoute($request)) {
            return redirect()->route('setup.welcome');
        }

        // If installed and trying to access setup routes, redirect to home
        if ($isInstalled && $this->isSetupRoute($request)) {
            return redirect('/');
        }

        return $next($request);
    }

    /**
     * Check if the current request is for a setup route.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    private function isSetupRoute(Request $request): bool
    {
        return $request->is('setup*');
    }
}