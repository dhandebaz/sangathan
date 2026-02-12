<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\SystemAdminLoginController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\OrganisationPaymentProfileController;
use App\Http\Controllers\PaymentClaimController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\PublicFormController;
use App\Http\Controllers\SetupController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\SystemAdminController;
use App\Http\Controllers\SupporterController;
use App\Http\Controllers\WebhookController;
use App\Http\Middleware\Authenticate;
use App\Http\Middleware\CheckInstallation;
use App\Http\Middleware\OrganisationContext;
use App\Http\Middleware\SystemAdmin as SystemAdminMiddleware;
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
    // Razorpay Webhook
    Route::post('/webhooks/razorpay', [WebhookController::class, 'handleRazorpay'])->name('webhooks.razorpay');

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
| Public Form Routes (No Authentication Required)
|--------------------------------------------------------------------------
*/

Route::middleware([CheckInstallation::class])->prefix('forms/{organisation}/{form}')->name('public.forms.')->group(function () {
    Route::get('/', [PublicFormController::class, 'show'])->name('show');
    Route::post('/submit', [PublicFormController::class, 'submit'])->name('submit');
    Route::get('/success', [PublicFormController::class, 'success'])->name('success');
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
        
        // Supporter Routes
        Route::middleware(['role:admin'])->prefix('supporter')->name('supporter.')->group(function () {
            Route::get('/', [SupporterController::class, 'index'])->name('index');
            Route::post('/subscribe', [SupporterController::class, 'subscribe'])->name('subscribe');
            Route::post('/settings', [SupporterController::class, 'updateSettings'])->name('settings.update');
        });

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
        
        // Meeting Register Routes
        Route::prefix('meetings')->name('meetings.')->group(function () {
            // All authenticated users can view meetings
            Route::get('/', [MeetingController::class, 'index'])->name('index');
            Route::get('/{meeting}', [MeetingController::class, 'show'])->name('show');
            
            // Admin and Editor can create meetings
            Route::middleware(['role:admin,editor'])->group(function () {
                Route::get('/create', [MeetingController::class, 'create'])->name('create');
                Route::post('/', [MeetingController::class, 'store'])->name('store');
                Route::get('/{meeting}/edit', [MeetingController::class, 'edit'])->name('edit');
                Route::put('/{meeting}', [MeetingController::class, 'update'])->name('update');
            });
            
            // Only Admin can delete meetings
            Route::middleware(['role:admin'])->group(function () {
                Route::delete('/{meeting}', [MeetingController::class, 'destroy'])->name('destroy');
            });
        });
        
        // Form Builder Routes
        Route::prefix('forms')->name('forms.')->group(function () {
            // All authenticated users can view forms
            Route::get('/', [FormController::class, 'index'])->name('index');
            
            // Admin and Editor can create forms
            Route::middleware(['role:admin,editor'])->group(function () {
                Route::get('/create', [FormController::class, 'create'])->name('create');
                Route::post('/', [FormController::class, 'store'])->name('store');
                Route::get('/{form}/edit', [FormController::class, 'edit'])->name('edit');
                Route::put('/{form}', [FormController::class, 'update'])->name('update');
                Route::get('/{form}/builder', [FormController::class, 'builder'])->name('builder');
                Route::post('/{form}/fields', [FormController::class, 'addField'])->name('add-field');
                Route::post('/{form}/fields/order', [FormController::class, 'updateFieldOrder'])->name('update-field-order');
                Route::delete('/{form}/fields/{field}', [FormController::class, 'deleteField'])->name('delete-field');
            });
            
            // Only Admin can delete forms
            Route::middleware(['role:admin'])->group(function () {
                Route::delete('/{form}', [FormController::class, 'destroy'])->name('destroy');
            });
            
            // Form Submissions Routes
            Route::prefix('{form}/submissions')->name('forms.submissions.')->group(function () {
                Route::get('/', [SubmissionController::class, 'index'])->name('index');
                Route::get('/{submission}', [SubmissionController::class, 'show'])->name('show');
                Route::post('/{submission}/convert-to-member', [SubmissionController::class, 'convertToMember'])->name('convert-to-member');
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
        
        // PDF Export Routes
        Route::prefix('export')->name('export.')->group(function () {
            Route::get('/members/pdf', [PdfController::class, 'exportMembers'])->name('members.pdf');
            Route::get('/donations/pdf', [PdfController::class, 'exportDonations'])->name('donations.pdf');
            Route::get('/meetings/{meeting}/minutes/pdf', [PdfController::class, 'exportMeetingMinutes'])->name('meeting.minutes.pdf');
            Route::get('/forms/{form}/submissions/pdf', [PdfController::class, 'exportFormSubmissionsSummary'])->name('form.submissions.pdf');
            Route::get('/submissions/{submission}/pdf', [PdfController::class, 'exportFormSubmission'])->name('submission.pdf');
        });
        
        // Payment Routes
        Route::prefix('payments')->name('payments.')->group(function () {
            // Public payment page (no auth required)
            Route::get('/{organisation}', [PaymentController::class, 'publicPage'])->name('public.page');
            
            // Payment profile management (Admin and Editor only)
            Route::middleware(['role:admin,editor'])->group(function () {
                Route::get('/{organisation}/settings', [OrganisationPaymentProfileController::class, 'edit'])->name('settings.edit');
                Route::put('/{organisation}/settings', [OrganisationPaymentProfileController::class, 'update'])->name('profile.update');
            });
            
            // Payment claims management
            Route::prefix('{organisation}/claims')->name('payments.claims.')->group(function () {
                // Public claim submission (no auth required)
                Route::post('/', [PaymentClaimController::class, 'store'])->name('store');
                Route::get('/success', [PaymentClaimController::class, 'success'])->name('success');
                
                // Admin and Editor can view and manage claims
                Route::middleware(['role:admin,editor'])->group(function () {
                    Route::get('/', [PaymentClaimController::class, 'index'])->name('index');
                    Route::get('/{claim}', [PaymentClaimController::class, 'show'])->name('show');
                    Route::post('/{claim}/verify', [PaymentClaimController::class, 'verify'])->name('verify');
                    Route::post('/{claim}/reject', [PaymentClaimController::class, 'reject'])->name('reject');
                });
            });
        });
        
        // Donation Routes
        Route::prefix('donations')->name('donations.')->group(function () {
            Route::get('/', [DonationController::class, 'index'])->name('index');
            Route::get('/create', [DonationController::class, 'create'])->name('create');
            Route::post('/', [DonationController::class, 'store'])->name('store');
            Route::get('/{donation}', [DonationController::class, 'show'])->name('show');
            Route::middleware(['role:admin,editor'])->group(function () {
                Route::get('/{donation}/edit', [DonationController::class, 'edit'])->name('edit');
                Route::put('/{donation}', [DonationController::class, 'update'])->name('update');
                Route::delete('/{donation}', [DonationController::class, 'destroy'])->name('destroy');
            });
        });
    });
});

/*
|--------------------------------------------------------------------------
| System Admin Routes
|--------------------------------------------------------------------------
*/

Route::prefix('system-admin')->name('system-admin.')->group(function () {
    // Login routes (no auth required)
    Route::get('/login', [SystemAdminLoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [SystemAdminLoginController::class, 'login']);
    
    // Protected routes (system admin only)
    Route::middleware([SystemAdminMiddleware::class])->group(function () {
        Route::post('/logout', [SystemAdminLoginController::class, 'logout'])->name('logout');
        
        // Dashboard
        Route::get('/dashboard', [SystemAdminController::class, 'dashboard'])->name('dashboard');
        
        // Organisations management
        Route::prefix('organisations')->name('organisations.')->group(function () {
            Route::get('/', [SystemAdminController::class, 'organisations'])->name('index');
            Route::get('/{organisation}', [SystemAdminController::class, 'organisation'])->name('show');
            Route::post('/{organisation}/suspend', [SystemAdminController::class, 'suspendOrganisation'])->name('suspend');
            Route::post('/{organisation}/unsuspend', [SystemAdminController::class, 'unsuspendOrganisation'])->name('unsuspend');
            Route::post('/{organisation}/toggle-supporter', [SystemAdminController::class, 'toggleSupporterStatus'])->name('toggle-supporter');
        });
        
        // Users management
        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/', [SystemAdminController::class, 'users'])->name('index');
            Route::get('/{user}', [SystemAdminController::class, 'user'])->name('show');
            Route::post('/{user}/disable', [SystemAdminController::class, 'disableUser'])->name('disable');
            Route::post('/{user}/enable', [SystemAdminController::class, 'enableUser'])->name('enable');
        });
        
        // Supporters overview
        Route::get('/supporters', [SystemAdminController::class, 'supporters'])->name('supporters');
        
        // Forms abuse monitoring
        Route::prefix('forms-abuse')->name('forms-abuse.')->group(function () {
            Route::get('/', [SystemAdminController::class, 'formsAbuse'])->name('index');
            Route::post('/forms/{form}/disable', [SystemAdminController::class, 'disableForm'])->name('forms.disable');
            Route::post('/forms/{form}/enable', [SystemAdminController::class, 'enableForm'])->name('forms.enable');
        });
        
        // Storage monitoring
        Route::get('/storage', [SystemAdminController::class, 'storage'])->name('storage');
        
        // Audit logs
        Route::get('/audit-logs', [SystemAdminController::class, 'auditLogs'])->name('audit-logs');
    });
});