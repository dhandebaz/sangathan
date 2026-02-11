<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sangathan</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-orange-500">
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <h1 class="text-3xl font-bold text-black mb-6">Sangathan</h1>
            <p class="text-black mb-8">Multi-tenant web application ready for deployment</p>
            
            @if(app(\App\Services\InstallationService::class)->isInstalled())
                <div class="space-y-4">
                    <div class="flex flex-col sm:flex-row gap-4">
                        <a href="{{ route('login') }}" class="flex-1 bg-orange-500 text-black text-center py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                            Login
                        </a>
                        <a href="{{ route('register') }}" class="flex-1 bg-white border-2 border-orange-500 text-orange-600 text-center py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                            Register
                        </a>
                    </div>
                    <p class="text-sm text-black">
                        Application is installed and ready to use.
                    </p>
                </div>
            @else
                <div class="space-y-4">
                    <a href="{{ route('setup.welcome') }}" class="block w-full bg-orange-500 text-black text-center py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                        Setup Application
                    </a>
                    <p class="text-sm text-black">
                        Click here to run the setup wizard and configure your application.
                    </p>
                </div>
            @endif
        </div>
    </div>
</body>
</html>