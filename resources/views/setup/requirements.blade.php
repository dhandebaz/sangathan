<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>System Requirements - Sangathan Setup</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-orange-500">
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
            <h1 class="text-3xl font-bold text-black mb-6">System Requirements</h1>
            
            @if(session('error'))
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {{ session('error') }}
                </div>
            @endif

            <div class="space-y-4">
                @foreach($requirements as $requirement => $data)
                    <div class="flex justify-between items-center p-4 border {{ $data['passed'] ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50' }} rounded">
                        <span class="text-black font-medium">{{ ucwords(str_replace('_', ' ', $requirement)) }}</span>
                        <span class="text-black font-semibold">
                            @if($data['passed'])
                                <span class="text-green-600">✓ Passed</span>
                            @else
                                <span class="text-red-600">✗ Failed</span>
                            @endif
                        </span>
                    </div>
                @endforeach
            </div>
            
            <div class="mt-8 flex justify-between">
                <a href="{{ route('setup.welcome') }}" class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors">
                    Back
                </a>
                
                @php
                    $allPassed = collect($requirements)->every('passed');
                @endphp
                
                @if($allPassed)
                    <a href="{{ route('setup.database') }}" class="bg-orange-500 text-black px-6 py-2 rounded font-semibold hover:bg-orange-600 transition-colors">
                        Continue
                    </a>
                @else
                    <button disabled class="bg-gray-300 text-gray-500 px-6 py-2 rounded cursor-not-allowed">
                        Requirements Not Met
                    </button>
                @endif
            </div>
        </div>
    </div>
</body>
</html>