<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Configuration - Sangathan Setup</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-orange-500">
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h1 class="text-3xl font-bold text-black mb-6">Application Configuration</h1>
            
            @if(session('error'))
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {{ session('error') }}
                </div>
            @endif

            <form method="POST" action="{{ route('setup.application.store') }}" class="space-y-4">
                @csrf
                
                <div>
                    <label for="app_name" class="block text-black font-semibold mb-2">Application Name</label>
                    <input type="text" 
                           id="app_name" 
                           name="app_name" 
                           value="{{ old('app_name', 'Sangathan') }}" 
                           class="w-full p-3 border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500 @error('app_name') border-red-500 @enderror"
                           required>
                    @error('app_name')
                        <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
                    @enderror
                    <p class="text-sm text-black mt-1">This will be your application's name</p>
                </div>
                
                <div>
                    <label for="admin_email" class="block text-black font-semibold mb-2">Administrator Email</label>
                    <input type="email" 
                           id="admin_email" 
                           name="admin_email" 
                           value="{{ old('admin_email') }}" 
                           class="w-full p-3 border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500 @error('admin_email') border-red-500 @enderror"
                           required>
                    @error('admin_email')
                        <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
                    @enderror
                    <p class="text-sm text-black mt-1">This will be the system administrator's email</p>
                </div>
                
                <div>
                    <label for="admin_password" class="block text-black font-semibold mb-2">Administrator Password</label>
                    <input type="password" 
                           id="admin_password" 
                           name="admin_password" 
                           class="w-full p-3 border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500 @error('admin_password') border-red-500 @enderror"
                           required>
                    @error('admin_password')
                        <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
                    @enderror
                    <p class="text-sm text-black mt-1">Minimum 8 characters required</p>
                </div>
                
                <div>
                    <label for="admin_password_confirmation" class="block text-black font-semibold mb-2">Confirm Password</label>
                    <input type="password" 
                           id="admin_password_confirmation" 
                           name="admin_password_confirmation" 
                           class="w-full p-3 border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                           required>
                </div>
                
                <div class="flex justify-between pt-4">
                    <a href="{{ route('setup.database') }}" class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors">
                        Back
                    </a>
                    <button type="submit" class="bg-orange-500 text-black px-6 py-2 rounded font-semibold hover:bg-orange-600 transition-colors">
                        Continue
                    </button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>