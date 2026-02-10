<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Organization Setup - Sangathan</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>
<body class="bg-orange-500">
    <div class="min-h-screen flex items-center justify-center">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h1 class="text-3xl font-bold text-black mb-6">Organization Setup</h1>
            
            <form method="POST" action="#" class="space-y-4">
                @csrf
                
                <div>
                    <label for="org_name" class="block text-black font-semibold mb-2">Organization Name</label>
                    <input type="text" id="org_name" name="org_name" class="w-full p-3 border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
                
                <div>
                    <label for="org_domain" class="block text-black font-semibold mb-2">Organization Domain</label>
                    <input type="text" id="org_domain" name="org_domain" placeholder="your-org" class="w-full p-3 border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <p class="text-sm text-black mt-1">This will be your unique subdomain</p>
                </div>
                
                <div>
                    <label for="admin_name" class="block text-black font-semibold mb-2">Administrator Name</label>
                    <input type="text" id="admin_name" name="admin_name" class="w-full p-3 border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500">
                </div>
                
                <div>
                    <label for="admin_email" class="block text-black font-semibold mb-2">Administrator Email</label>
                    <input type="email" id="admin_email" name="admin_email" class="w-full p-3 border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500">
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