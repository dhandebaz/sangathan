<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Sangathan</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-orange-500">
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-black mb-2">Sangathan</h1>
                <p class="text-black">Sign in to your account</p>
            </div>

            @if(session('error'))
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {{ session('error') }}
                </div>
            @endif

            @if(session('success'))
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                    {{ session('success') }}
                </div>
            @endif

            <form method="POST" action="#" class="space-y-4">
                @csrf
                
                <div>
                    <label for="email" class="block text-black font-semibold mb-2">Email Address</label>
                    <input type="email" 
                           id="email" 
                           name="email" 
                           value="{{ old('email') }}" 
                           class="w-full p-3 border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500 @error('email') border-red-500 @enderror"
                           required>
                    @error('email')
                        <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>
                
                <div>
                    <label for="password" class="block text-black font-semibold mb-2">Password</label>
                    <input type="password" 
                           id="password" 
                           name="password" 
                           class="w-full p-3 border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500 @error('password') border-red-500 @enderror"
                           required>
                    @error('password')
                        <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>
                
                <div class="flex items-center justify-between">
                    <label class="flex items-center">
                        <input type="checkbox" name="remember" class="mr-2">
                        <span class="text-black text-sm">Remember me</span>
                    </label>
                    <a href="#" class="text-orange-600 hover:text-orange-700 text-sm">Forgot password?</a>
                </div>
                
                <button type="submit" class="w-full bg-orange-500 text-black py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                    Sign In
                </button>
            </form>
        </div>
    </div>
</body>
</html>