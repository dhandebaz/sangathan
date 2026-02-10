<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Configuration - Sangathan Setup</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-orange-500">
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h1 class="text-3xl font-bold text-black mb-6">Database Configuration</h1>
            
            @if(session('error'))
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {{ session('error') }}
                </div>
            @endif

            <form method="POST" action="{{ route('setup.database.store') }}" class="space-y-4">
                @csrf
                
                <div>
                    <label for="db_host" class="block text-black font-semibold mb-2">Database Host</label>
                    <input type="text" 
                           id="db_host" 
                           name="db_host" 
                           value="{{ old('db_host', 'localhost') }}" 
                           class="w-full p-3 border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500 @error('db_host') border-red-500 @enderror"
                           required>
                    @error('db_host')
                        <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>
                
                <div>
                    <label for="db_port" class="block text-black font-semibold mb-2">Database Port</label>
                    <input type="number" 
                           id="db_port" 
                           name="db_port" 
                           value="{{ old('db_port', '3306') }}" 
                           class="w-full p-3 border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500 @error('db_port') border-red-500 @enderror"
                           required>
                    @error('db_port')
                        <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>
                
                <div>
                    <label for="db_name" class="block text-black font-semibold mb-2">Database Name</label>
                    <input type="text" 
                           id="db_name" 
                           name="db_name" 
                           value="{{ old('db_name') }}" 
                           class="w-full p-3 border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500 @error('db_name') border-red-500 @enderror"
                           required>
                    @error('db_name')
                        <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
                    @enderror
                    <p class="text-sm text-black mt-1">Only letters, numbers, and underscores allowed</p>
                </div>
                
                <div>
                    <label for="db_username" class="block text-black font-semibold mb-2">Database Username</label>
                    <input type="text" 
                           id="db_username" 
                           name="db_username" 
                           value="{{ old('db_username') }}" 
                           class="w-full p-3 border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500 @error('db_username') border-red-500 @enderror"
                           required>
                    @error('db_username')
                        <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>
                
                <div>
                    <label for="db_password" class="block text-black font-semibold mb-2">Database Password</label>
                    <input type="password" 
                           id="db_password" 
                           name="db_password" 
                           class="w-full p-3 border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500 @error('db_password') border-red-500 @enderror"
                           required>
                    @error('db_password')
                        <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>
                
                <div class="flex justify-between pt-4">
                    <a href="{{ route('setup.requirements') }}" class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors">
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