<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;

class CheckMaintenanceMode
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if maintenance mode file exists
        if (Storage::exists('maintenance_mode')) {
            // Allow access to login routes
            if ($request->routeIs('login', 'logout', 'system-admin.login')) {
                return $next($request);
            }

            // Allow access to System Admin IP or authenticated System Admin
            $user = $request->user();
            if ($user && $user->is_system_admin) {
                return $next($request);
            }

            // Return 503 Service Unavailable
            return response()->view('errors.503', [], 503);
        }

        return $next($request);
    }
}
