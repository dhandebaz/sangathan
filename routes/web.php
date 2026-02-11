<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\SetupController;
use App\Http\Middleware\Authenticate;
use App\Http\Middleware\CheckInstallation;
use App\Http\Middleware\OrganisationContext;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Setup Routes (Installation Wizard)
|--------------------------------------------------------------------------
*/

Route::prefix('setup')->name('setup.')->group(function () {
    Route::get('/', [SetupController::class, 'welcome'])->name('welcome');
    Route::get('/requirements', [SetupController::class, 'requirements'])->name('requirements');
    Route::get('/database', [SetupController::class, 'database'])->name('database');
    Route::post('/database', [SetupController::class, 'storeDatabase'])->name('database.store');
    Route::get('/application', [SetupController::class, 'application'])->name('application');
    Route::post('/application', [SetupController::class, 'storeApplication'])->name('application.store');
    Route::get('/install', [SetupController::class, 'install'])->name('install');
    Route::post('/install', [SetupController::class, 'processInstall'])->name('install.process');
    Route::get('/complete', [SetupController::class, 'complete'])->name('complete');
});

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

Route::middleware([CheckInstallation::class])->group(function () {
    // Login routes
    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [LoginController::class, 'login']);
    
    // Registration routes
    Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register');
    Route::post('/register', [RegisterController::class, 'register']);
    
    // Logout route
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
});

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::middleware([CheckInstallation::class])->group(function () {
    Route::get('/', function () {
        return view('welcome');
    });

    // Protected routes (require authentication)
    Route::middleware(['auth', 'org.context'])->group(function () {
        Route::get('/dashboard', function () {
            return view('dashboard');
        })->name('dashboard');
        
        // Member Register Routes
        Route::prefix('members')->name('members.')->group(function () {
            // All authenticated users can view members
            Route::get('/', [MemberController::class, 'index'])->name('index');
            Route::get('/{member}', [MemberController::class, 'show'])->name('show');
            
            // Admin and Editor can create members
            Route::middleware(['role:admin,editor'])->group(function () {
                Route::get('/create', [MemberController::class, 'create'])->name('create');
                Route::post('/', [MemberController::class, 'store'])->name('store');
                Route::get('/{member}/edit', [MemberController::class, 'edit'])->name('edit');
                Route::put('/{member}', [MemberController::class, 'update'])->name('update');
                Route::post('/{member}/toggle-status', [MemberController::class, 'toggleStatus'])->name('toggle-status');
            });
            
            // Only Admin can delete members
            Route::middleware(['role:admin'])->group(function () {
                Route::delete('/{member}', [MemberController::class, 'destroy'])->name('destroy');
            });
        });
        
        // Admin only routes
        Route::middleware(['role:admin'])->group(function () {
            // Add admin routes here
        });
        
        // Editor and Admin routes
        Route::middleware(['role:admin,editor'])->group(function () {
            // Add editor routes here
        });
        
        // All authenticated users
        Route::middleware(['role:admin,editor,viewer'])->group(function () {
            // Add viewer routes here
        });
    });
});