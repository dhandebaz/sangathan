@extends('layouts.app')

@section('page-title', 'Supporter Plan')

@section('content')
<div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-lg border border-black p-6 shadow-sm">
        @if($organisation->is_supporter)
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold mb-2">You are a Supporter!</h2>
                <p class="text-gray-600">Thank you for supporting Sangathan. Member since {{ $organisation->supporter_since->format('F j, Y') }}.</p>
            </div>

            <div class="border-t border-black pt-6">
                <h3 class="text-lg font-semibold mb-4">Supporter Settings</h3>
                
                <form action="{{ route('supporter.settings.update') }}" method="POST">
                    @csrf
                    <div class="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded">
                        <div>
                            <span class="font-medium">Remove "Powered by Sangathan" Branding</span>
                            <p class="text-sm text-gray-600">Hide the branding from your public forms and dashboard footer.</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="hidden" name="branding_disabled" value="0">
                            <input type="checkbox" name="branding_disabled" value="1" class="sr-only peer" {{ $organisation->branding_disabled ? 'checked' : '' }}>
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                        </label>
                    </div>
                    
                    <div class="mt-4 text-right">
                        <button type="submit" class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors">
                            Save Settings
                        </button>
                    </div>
                </form>
            </div>
        @else
            <div class="text-center">
                <h2 class="text-2xl font-bold mb-4">Become a Sangathan Supporter</h2>
                <p class="text-lg text-gray-600 mb-8">Support the development of this open-source platform and unlock premium perks.</p>
                
                <div class="grid md:grid-cols-3 gap-6 mb-8 text-left">
                    <div class="p-4 border border-gray-200 rounded">
                        <div class="font-semibold mb-2">🌱 Sustainability</div>
                        <p class="text-sm text-gray-600">Help us maintain servers and develop new features.</p>
                    </div>
                    <div class="p-4 border border-gray-200 rounded">
                        <div class="font-semibold mb-2">🏷️ Branding Removal</div>
                        <p class="text-sm text-gray-600">Option to hide "Powered by Sangathan" from your pages.</p>
                    </div>
                    <div class="p-4 border border-gray-200 rounded">
                        <div class="font-semibold mb-2">🏅 Supporter Badge</div>
                        <p class="text-sm text-gray-600">Show your commitment to the community.</p>
                    </div>
                </div>

                <div class="bg-orange-50 p-6 rounded border border-orange-200 inline-block w-full max-w-md">
                    <div class="text-3xl font-bold mb-2">₹99<span class="text-base font-normal text-gray-600">/month</span></div>
                    <p class="text-sm text-gray-500 mb-6">Cancel anytime.</p>
                    
                    <form action="{{ route('supporter.subscribe') }}" method="POST">
                        @csrf
                        <button type="submit" class="w-full bg-black text-white font-bold py-3 px-6 rounded hover:bg-gray-800 transition-colors">
                            Become a Supporter
                        </button>
                    </form>
                </div>
            </div>
        @endif
    </div>
</div>
@endsection
