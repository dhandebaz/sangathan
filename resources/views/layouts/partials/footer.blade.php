<!-- Footer Component for Authenticated Users -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="py-6">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <!-- Left Section: Copyright and Links -->
            <div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                @php
                    $currentOrg = \App\Models\Organisation::find(session('current_organisation_id'));
                    $showBranding = $currentOrg ? (!$currentOrg->is_supporter || !$currentOrg->branding_disabled) : true;
                @endphp

                @if($showBranding)
                    <p class="text-sm text-black">
                        &copy; {{ date('Y') }} {{ config('app.name', 'Sangathan') }}. All rights reserved.
                    </p>
                @else
                    <p class="text-sm text-black">
                        &copy; {{ date('Y') }} All rights reserved.
                    </p>
                @endif
                
                <div class="flex space-x-4">
                    <a href="#" class="text-sm text-black hover:text-orange-600 transition-colors duration-150">
                        About
                    </a>
                    <a href="#" class="text-sm text-black hover:text-orange-600 transition-colors duration-150">
                        Privacy
                    </a>
                    <a href="#" class="text-sm text-black hover:text-orange-600 transition-colors duration-150">
                        Terms
                    </a>
                    <a href="#" class="text-sm text-black hover:text-orange-600 transition-colors duration-150">
                        Support
                    </a>
                </div>
            </div>

            <!-- Right Section: Version and Status -->
            <div class="flex items-center space-x-4">
                <!-- System Status -->
                <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span class="text-sm text-black">System Online</span>
                </div>

                <!-- Version -->
                <span class="text-sm text-black">
                    v1.0.0
                </span>
            </div>
        </div>

        <!-- Optional: Additional footer information -->
        @if(app()->environment('local'))
            <div class="mt-4 pt-4 border-t border-black">
                <p class="text-xs text-black">
                    Environment: {{ app()->environment() }} | 
                    Laravel: {{ app()->version() }} | 
                    PHP: {{ phpversion() }}
                </p>
            </div>
        @endif
    </div>
</div>