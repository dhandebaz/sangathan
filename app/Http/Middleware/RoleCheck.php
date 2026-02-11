<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = auth()->user();
        $organisationId = session('current_organisation_id');
        
        if (!$user || !$organisationId) {
            return redirect()->route('login');
        }
        
        // Check if user has any of the required roles in the current organisation
        $hasRole = false;
        foreach ($roles as $role) {
            if ($user->hasRoleInOrganisation($organisationId, $role)) {
                $hasRole = true;
                break;
            }
        }
        
        if (!$hasRole) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Insufficient permissions.'], 403);
            }
            
            return redirect()->route('dashboard')->with('error', 'You do not have permission to access this resource.');
        }
        
        return $next($request);
    }
}