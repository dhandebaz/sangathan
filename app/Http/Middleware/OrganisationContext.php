<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OrganisationContext
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();
        
        if (!$user) {
            return redirect()->route('login');
        }
        
        // Check if user has any organisations
        if ($user->organisations()->count() === 0) {
            // If user has no organisations, redirect to organisation creation
            if (!$request->routeIs('register') && !$request->routeIs('logout')) {
                return redirect()->route('register')->with('error', 'You must belong to an organisation to access the application.');
            }
        }
        
        // Set the current organisation in session if not set
        if (!session()->has('current_organisation_id')) {
            $primaryOrganisation = $user->primaryOrganisation();
            if ($primaryOrganisation) {
                session(['current_organisation_id' => $primaryOrganisation->id]);
            } elseif ($user->organisations()->count() > 0) {
                $firstOrganisation = $user->organisations()->first();
                session(['current_organisation_id' => $firstOrganisation->id]);
            }
        }
        
        return $next($request);
    }
}