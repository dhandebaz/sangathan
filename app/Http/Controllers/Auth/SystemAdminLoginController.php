<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class SystemAdminLoginController extends Controller
{
    /**
     * Show system admin login form.
     */
    public function showLoginForm()
    {
        return view('auth.system-admin-login');
    }

    /**
     * Handle system admin login request.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)
                   ->where('is_system_admin', true)
                   ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['These credentials do not match our records or you do not have system admin privileges.'],
            ]);
        }

        if ($user->is_disabled) {
            throw ValidationException::withMessages([
                'email' => ['Your account has been disabled.'],
            ]);
        }

        Auth::login($user, $request->filled('remember'));

        // Log the login action
        AuditLog::log('system_admin_login', $user, [], $request);

        $request->session()->regenerate();

        return redirect()->intended('/system-admin/dashboard');
    }

    /**
     * Logout system admin.
     */
    public function logout(Request $request)
    {
        $user = auth()->user();

        // Log the logout action
        AuditLog::log('system_admin_logout', $user, [], $request);

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/system-admin/login');
    }
}