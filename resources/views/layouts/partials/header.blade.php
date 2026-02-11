<!-- Header Component for Authenticated Users -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
        <!-- Left Section: Logo and Navigation -->
        <div class="flex items-center">
            <!-- Logo/Brand -->
            <div class="flex-shrink-0">
                <a href="{{ route('dashboard') }}" class="text-xl font-semibold text-black hover:text-orange-600 transition-colors duration-150">
                    {{ config('app.name', 'Sangathan') }}
                </a>
            </div>

            <!-- Desktop Navigation -->
            <nav class="hidden md:ml-8 md:flex md:space-x-4">
                <a href="{{ route('dashboard') }}" class="text-black hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors duration-150">
                    Dashboard
                </a>
                <a href="{{ route('members.index') }}" class="text-black hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors duration-150">
                    Members
                </a>
                <a href="#" class="text-black hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors duration-150">
                    Users
                </a>
                <a href="#" class="text-black hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors duration-150">
                    Settings
                </a>
            </nav>
        </div>

        <!-- Right Section: User Menu -->
        <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <div class="relative">
                <button class="text-black hover:text-orange-600 p-2 transition-colors duration-150">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                    </svg>
                    <span class="sr-only">Notifications</span>
                </button>
            </div>

            <!-- User Dropdown -->
            <div class="relative" x-data="{ open: false }">
                <button @click="open = !open" class="flex items-center text-black hover:text-orange-600 p-2 transition-colors duration-150">
                    <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-2">
                        <span class="text-orange-600 font-medium text-sm">
                            {{ substr(Auth::user()->name ?? 'A', 0, 1) }}
                        </span>
                    </div>
                    <span class="hidden md:block text-sm font-medium">
                        {{ Auth::user()->name ?? 'User' }}
                    </span>
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                <!-- Dropdown Menu -->
                <div x-show="open" 
                     @click.away="open = false"
                     x-transition:enter="transition ease-out duration-150"
                     x-transition:enter-start="transform opacity-0 scale-95"
                     x-transition:enter-end="transform opacity-100 scale-100"
                     x-transition:leave="transition ease-in duration-150"
                     x-transition:leave-start="transform opacity-100 scale-100"
                     x-transition:leave-end="transform opacity-0 scale-95"
                     class="absolute right-0 mt-2 w-48 bg-white border border-black rounded-lg shadow-lg z-50">
                    
                    <div class="py-1">
                        <a href="#" class="block px-4 py-2 text-sm text-black hover:bg-orange-50 transition-colors duration-150">
                            Profile
                        </a>
                        <a href="#" class="block px-4 py-2 text-sm text-black hover:bg-orange-50 transition-colors duration-150">
                            Settings
                        </a>
                        <hr class="border-black">
                        <form method="POST" action="{{ route('logout') }}" class="block">
                            @csrf
                            <button type="submit" class="block w-full text-left px-4 py-2 text-sm text-black hover:bg-orange-50 transition-colors duration-150">
                                Sign out
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Mobile Menu Button -->
            <button class="md:hidden text-black hover:text-orange-600 p-2 transition-colors duration-150">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>
    </div>

    <!-- Mobile Navigation -->
    <div class="md:hidden border-t border-black">
        <div class="px-2 pt-2 pb-3 space-y-1">
            <a href="{{ route('dashboard') }}" class="text-black hover:text-orange-600 block px-3 py-2 text-base font-medium transition-colors duration-150">
                Dashboard
            </a>
            <a href="{{ route('members.index') }}" class="text-black hover:text-orange-600 block px-3 py-2 text-base font-medium transition-colors duration-150">
                Members
            </a>
            <a href="#" class="text-black hover:text-orange-600 block px-3 py-2 text-base font-medium transition-colors duration-150">
                Users
            </a>
            <a href="#" class="text-black hover:text-orange-600 block px-3 py-2 text-base font-medium transition-colors duration-150">
                Settings
            </a>
        </div>
    </div>
</div>