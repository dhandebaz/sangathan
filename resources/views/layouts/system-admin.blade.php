<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-orange-500">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>{{ config('app.name', 'Sangathan') }} - System Admin - @yield('title', 'Dashboard')</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Styles -->
    @stack('styles')
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    
    <!-- Scripts -->
    @stack('head-scripts')
</head>
<body class="h-full font-sans text-black bg-orange-500">
    <div class="min-h-screen flex flex-col">
        <!-- Header -->
        <header class="bg-white border-b border-black sticky top-0 z-50">
            <div class="px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                            <span class="text-black font-bold text-lg">SA</span>
                        </div>
                        <div class="ml-3">
                            <h1 class="text-xl font-bold text-black">Sangathan System Admin</h1>
                            <p class="text-sm text-black/70">Platform Administration</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-4">
                        <span class="text-sm text-black">{{ auth()->user()->name }}</span>
                        <form method="POST" action="{{ route('system-admin.logout') }}" class="inline">
                            @csrf
                            <button type="submit" class="text-sm text-black hover:text-orange-600 transition-colors">
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content Area -->
        <div class="flex-1 flex">
            <!-- Sidebar -->
            <aside class="w-64 bg-white border-r border-black">
                <nav class="p-4 space-y-2">
                    <!-- Dashboard -->
                    <a href="{{ route('system-admin.dashboard') }}" class="flex items-center px-3 py-2 text-sm font-medium text-black rounded-lg hover:bg-orange-50 transition-colors duration-150 {{ request()->routeIs('system-admin.dashboard') ? 'bg-orange-100 border border-orange-200' : '' }}">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5l7 7-7 7"></path>
                        </svg>
                        Dashboard
                    </a>

                    <!-- Organisations -->
                    <a href="{{ route('system-admin.organisations') }}" class="flex items-center px-3 py-2 text-sm font-medium text-black rounded-lg hover:bg-orange-50 transition-colors duration-150 {{ request()->routeIs('system-admin.organisations*') ? 'bg-orange-100 border border-orange-200' : '' }}">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        Organisations
                    </a>

                    <!-- Users -->
                    <a href="{{ route('system-admin.users') }}" class="flex items-center px-3 py-2 text-sm font-medium text-black rounded-lg hover:bg-orange-50 transition-colors duration-150 {{ request()->routeIs('system-admin.users*') ? 'bg-orange-100 border border-orange-200' : '' }}">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                        </svg>
                        Users
                    </a>

                    <!-- Supporters -->
                    <a href="{{ route('system-admin.supporters') }}" class="flex items-center px-3 py-2 text-sm font-medium text-black rounded-lg hover:bg-orange-50 transition-colors duration-150 {{ request()->routeIs('system-admin.supporters*') ? 'bg-orange-100 border border-orange-200' : '' }}">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Supporters
                    </a>

                    <!-- Forms Abuse -->
                    <a href="{{ route('system-admin.forms-abuse') }}" class="flex items-center px-3 py-2 text-sm font-medium text-black rounded-lg hover:bg-orange-50 transition-colors duration-150 {{ request()->routeIs('system-admin.forms-abuse*') ? 'bg-orange-100 border border-orange-200' : '' }}">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                        Forms Abuse
                    </a>

                    <!-- Storage -->
                    <a href="{{ route('system-admin.storage') }}" class="flex items-center px-3 py-2 text-sm font-medium text-black rounded-lg hover:bg-orange-50 transition-colors duration-150 {{ request()->routeIs('system-admin.storage*') ? 'bg-orange-100 border border-orange-200' : '' }}">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                        </svg>
                        Storage
                    </a>

                    <!-- Audit Logs -->
                    <a href="{{ route('system-admin.audit-logs') }}" class="flex items-center px-3 py-2 text-sm font-medium text-black rounded-lg hover:bg-orange-50 transition-colors duration-150 {{ request()->routeIs('system-admin.audit-logs*') ? 'bg-orange-100 border border-orange-200' : '' }}">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Audit Logs
                    </a>
                </nav>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 bg-white min-h-[calc(100vh-4rem)]">
                <!-- Page Header -->
                <div class="p-6 border-b border-black bg-white">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-2xl font-semibold text-black">@yield('page-title', 'Dashboard')</h1>
                            @hasSection('page-subtitle')
                                <p class="text-black mt-1">@yield('page-subtitle')</p>
                            @endif
                        </div>
                        <div>
                            @yield('page-actions')
                        </div>
                    </div>
                </div>

                <!-- Content -->
                <div class="p-6">
                    @if(session('success'))
                        <div class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p class="text-green-800">{{ session('success') }}</p>
                        </div>
                    @endif

                    @if(session('error'))
                        <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p class="text-red-800">{{ session('error') }}</p>
                        </div>
                    @endif

                    @if(session('warning'))
                        <div class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p class="text-yellow-800">{{ session('warning') }}</p>
                        </div>
                    @endif

                    @yield('content')
                </div>
            </main>
        </div>

        <!-- Footer -->
        <footer class="bg-white border-t border-black mt-auto">
            <div class="px-6 py-4 text-center text-sm text-black/70">
                Sangathan System Admin - Platform Administration
            </div>
        </footer>
    </div>

    <!-- Scripts -->
    @stack('scripts')
</body>
</html>