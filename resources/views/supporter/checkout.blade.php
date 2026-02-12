@extends('layouts.app')

@section('page-title', 'Complete Payment')

@section('content')
<div class="max-w-md mx-auto text-center">
    <div class="bg-white p-8 rounded-lg border border-black shadow-lg">
        <h2 class="text-2xl font-bold mb-6">Complete Subscription</h2>
        <p class="mb-6">Please complete the payment securely via Razorpay.</p>
        
        <div id="razorpay-button-container"></div>
        
        <a href="{{ route('supporter.index') }}" class="text-sm text-gray-500 mt-4 inline-block hover:underline">Cancel</a>
    </div>
</div>

<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script>
var options = {
    "key": "{{ $key_id }}",
    "subscription_id": "{{ $subscription_id }}",
    "name": "{{ $name }}",
    "description": "{{ $description }}",
    "image": "https://cdn.razorpay.com/logos/GhRQcyean79PqE_medium.png", 
    "handler": function (response){
        // Redirect to success
        window.location.href = "{{ route('supporter.index') }}?success=true";
    },
    "prefill": {
        "name": "{{ $organisation->name }}",
        "email": "{{ $organisation->email }}",
        "contact": "{{ $organisation->phone }}"
    },
    "theme": {
        "color": "#FF6B35"
    }
};
var rzp1 = new Razorpay(options);
rzp1.on('payment.failed', function (response){
    alert("Payment Failed: " + response.error.description);
});

// Auto open
rzp1.open();

document.getElementById('razorpay-button-container').innerHTML = '<button onclick="rzp1.open()" class="bg-black text-white font-bold py-2 px-4 rounded">Pay Now</button>';
</script>
@endsection
