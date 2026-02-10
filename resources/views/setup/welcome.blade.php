<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome - Sangathan Setup</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-orange-500">
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-black mb-2">Welcome to Sangathan</h1>
                <p class="text-black">Let's get your application set up</p>
            </div>

            @if(session('error'))
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {{ session('error') }}
                </div>
            @endif

            <div class="space-y-4">
                <a href="{{ route('setup.requirements') }}" class="block w-full bg-orange-500 text-black text-center py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                    Get Started
                </a>
            </div>

            <div class="mt-8 text-center">
                <p class="text-sm text-black">
                    This setup wizard will help you configure your database and create the administrator account.
                </p>
            </div>
        </div>
    </div>
</body>
</html>