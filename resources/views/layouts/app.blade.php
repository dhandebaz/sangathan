<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-orange-500">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>{{ config('app.name', 'Sangathan') }} - @yield('title', 'Dashboard')</title>
    
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
            @include('layouts.partials.header')
        </header>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col lg:flex-row">
            <!-- Sidebar (Mobile: hidden by default, Desktop: visible) -->
            <aside id="sidebar" class="hidden lg:block lg:w-64 bg-white border-r border-black lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]">
                @include('layouts.partials.sidebar')
            </aside>

            <!-- Main Content -->
            <main class="flex-1 bg-white min-h-[calc(100vh-4rem)]">
                <!-- Mobile Sidebar Toggle -->
                <div class="lg:hidden p-4 bg-orange-100 border-b border-black">
                    <button id="sidebar-toggle" class="flex items-center text-black hover:text-orange-600 transition-colors duration-150">
                        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                        Menu
                    </button>
                </div>

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
            @include('layouts.partials.footer')
        </footer>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div id="sidebar-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 hidden lg:hidden"></div>

    <!-- Scripts -->
    <script>
        // Mobile sidebar toggle
        document.getElementById('sidebar-toggle')?.addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            
            sidebar.classList.toggle('hidden');
            overlay.classList.toggle('hidden');
            
            // Add transition for smooth animation
            sidebar.style.transition = 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)';
        });

        // Close sidebar when overlay is clicked
        document.getElementById('sidebar-overlay')?.addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            
            sidebar.classList.add('hidden');
            overlay.classList.add('hidden');
        });

        // Close sidebar on window resize to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 1024) { // lg breakpoint
                const sidebar = document.getElementById('sidebar');
                const overlay = document.getElementById('sidebar-overlay');
                
                sidebar.classList.remove('hidden');
                overlay.classList.add('hidden');
            }
        });
    </script>

    @stack('scripts')
</body>
</html>