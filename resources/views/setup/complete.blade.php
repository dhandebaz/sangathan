<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Installation Complete - Sangathan</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-orange-500">
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <div class="mb-6">
                <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="text-white text-2xl font-bold">✓</span>
                </div>
                <h1 class="text-3xl font-bold text-black mb-2">Installation Complete!</h1>
                <p class="text-black">Your Sangathan application has been successfully configured.</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <h3 class="font-semibold text-black mb-2">Next Steps:</h3>
                <ul class="text-sm text-black space-y-1">
                    <li>• Your administrator account has been created</li>
                    <li>• Database has been configured and migrated</li>
                    <li>• Application is ready for use</li>
                </ul>
            </div>

            <div class="space-y-4">
                <a href="{{ route('login') }}" class="block w-full bg-orange-500 text-black text-center py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                    Go to Login
                </a>
            </div>

            <div class="mt-6 text-center">
                <p class="text-sm text-black">
                    <strong>Security Note:</strong> The setup wizard has been permanently disabled.
                </p>
            </div>
        </div>
    </div>
</body>
</html>