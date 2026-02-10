<?php

use App\Http\Controllers\SetupController;
use App\Http\Middleware\CheckInstallation;
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
| Web Routes
|--------------------------------------------------------------------------
*/

Route::middleware([CheckInstallation::class])->group(function () {
    Route::get('/', function () {
        return view('welcome');
    });

    // Authentication routes
    Route::get('/login', function () {
        return view('auth.login');
    })->name('login');

    // Protected routes (require authentication)
    Route::middleware(['auth'])->group(function () {
        Route::get('/dashboard', function () {
            return view('dashboard');
        })->name('dashboard');
        
        // Add more authenticated routes here
    });
});