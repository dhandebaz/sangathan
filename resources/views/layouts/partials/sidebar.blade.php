<!-- Sidebar Component for Authenticated Users -->
<div class="h-full flex flex-col">
    <!-- Sidebar Header -->
    <div class="p-4 border-b border-black">
        <div class="flex items-center">
            <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span class="text-black font-bold text-lg">S</span>
            </div>
            <div class="ml-3 hidden xl:block">
                <p class="text-black font-medium text-sm">{{ config('app.name', 'Sangathan') }}</p>
                <p class="text-black text-xs">Multi-tenant Platform</p>
            </div>
        </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <!-- Dashboard -->
        <a href="{{ route('dashboard') }}" class="flex items-center px-3 py-2 text-sm font-medium text-black rounded-lg hover:bg-orange-50 transition-colors duration-150 {{ request()->routeIs('dashboard') ? 'bg-orange-100 border border-orange-200' : '' }}">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5l7 7-7 7"></path>
            </svg>
            <span class="hidden xl:inline">Dashboard</span>
        </a>

        <!-- Users Management -->
        <div x-data="{ open: false }">
            <button @click="open = !open" class="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-black rounded-lg hover:bg-orange-50 transition-colors duration-150">
                <div class="flex items-center">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                    <span class="hidden xl:inline">Users</span>
                </div>
                <svg class="w-4 h-4 hidden xl:inline" :class="{ 'rotate-180': open }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            
            <div x-show="open" x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 transform -translate-y-2" x-transition:enter-end="opacity-100 transform translate-y-0" x-transition:leave="transition ease-in duration-150" x-transition:leave-start="opacity-100 transform translate-y-0" x-transition:leave-end="opacity-0 transform -translate-y-2" class="mt-2 space-y-1 pl-4">
                <a href="#" class="block px-3 py-2 text-sm text-black hover:bg-orange-50 rounded-lg transition-colors duration-150">All Users</a>
                <a href="#" class="block px-3 py-2 text-sm text-black hover:bg-orange-50 rounded-lg transition-colors duration-150">Add User</a>
                <a href="#" class="block px-3 py-2 text-sm text-black hover:bg-orange-50 rounded-lg transition-colors duration-150">Roles & Permissions</a>
            </div>
        </div>

        <!-- Organizations -->
        <a href="#" class="flex items-center px-3 py-2 text-sm font-medium text-black rounded-lg hover:bg-orange-50 transition-colors duration-150">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <span class="hidden xl:inline">Organizations</span>
        </a>

        <!-- Settings -->
        <div x-data="{ open: false }">
            <button @click="open = !open" class="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-black rounded-lg hover:bg-orange-50 transition-colors duration-150">
                <div class="flex items-center">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span class="hidden xl:inline">Settings</span>
                </div>
                <svg class="w-4 h-4 hidden xl:inline" :class="{ 'rotate-180': open }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            
            <div x-show="open" x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 transform -translate-y-2" x-transition:enter-end="opacity-100 transform translate-y-0" x-transition:leave="transition ease-in duration-150" x-transition:leave-start="opacity-100 transform translate-y-0" x-transition:leave-end="opacity-0 transform -translate-y-2" class="mt-2 space-y-1 pl-4">
                <a href="#" class="block px-3 py-2 text-sm text-black hover:bg-orange-50 rounded-lg transition-colors duration-150">General</a>
                <a href="#" class="block px-3 py-2 text-sm text-black hover:bg-orange-50 rounded-lg transition-colors duration-150">Security</a>
                <a href="#" class="block px-3 py-2 text-sm text-black hover:bg-orange-50 rounded-lg transition-colors duration-150">Appearance</a>
            </div>
        </div>
    </nav>

    <!-- Sidebar Footer -->
    <div class="p-4 border-t border-black">
        <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span class="text-orange-600 font-medium text-sm">
                    {{ substr(Auth::user()->name ?? 'A', 0, 1) }}
                </span>
            </div>
            <div class="hidden xl:block min-w-0 flex-1">
                <p class="text-sm font-medium text-black truncate">
                    {{ Auth::user()->name ?? 'User' }}
                </p>
                <p class="text-xs text-black truncate">
                    {{ Auth::user()->email ?? 'user@example.com' }}
                </p>
            </div>
        </div>
    </div>
</div>

<!-- Alpine.js for dropdown animations -->
<script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>