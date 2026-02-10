<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Installing - Sangathan Setup</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-orange-500">
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <h1 class="text-3xl font-bold text-black mb-6">Installing Sangathan</h1>
            
            <div class="mb-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p class="text-black" id="install-status">Preparing installation...</p>
            </div>
            
            <div class="space-y-2 text-left">
                <div class="flex items-center" id="step-env">
                    <span class="w-4 h-4 rounded-full bg-gray-300 mr-3"></span>
                    <span class="text-black">Configuring environment...</span>
                </div>
                <div class="flex items-center" id="step-key">
                    <span class="w-4 h-4 rounded-full bg-gray-300 mr-3"></span>
                    <span class="text-black">Generating application key...</span>
                </div>
                <div class="flex items-center" id="step-migrate">
                    <span class="w-4 h-4 rounded-full bg-gray-300 mr-3"></span>
                    <span class="text-black">Running database migrations...</span>
                </div>
                <div class="flex items-center" id="step-seed">
                    <span class="w-4 h-4 rounded-full bg-gray-300 mr-3"></span>
                    <span class="text-black">Creating administrator account...</span>
                </div>
                <div class="flex items-center" id="step-complete">
                    <span class="w-4 h-4 rounded-full bg-gray-300 mr-3"></span>
                    <span class="text-black">Finalizing installation...</span>
                </div>
            </div>
            
            <div id="error-message" class="mt-6 hidden">
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p id="error-text"></p>
                    <button onclick="location.reload()" class="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                        Retry Installation
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Installation progress tracking
        const steps = [
            { id: 'step-env', message: 'Configuring environment...' },
            { id: 'step-key', message: 'Generating application key...' },
            { id: 'step-migrate', message: 'Running database migrations...' },
            { id: 'step-seed', message: 'Creating administrator account...' },
            { id: 'step-complete', message: 'Finalizing installation...' }
        ];

        let currentStep = 0;

        function updateStep(stepId, success = true) {
            const stepElement = document.getElementById(stepId);
            const circle = stepElement.querySelector('span:first-child');
            
            if (success) {
                circle.classList.remove('bg-gray-300');
                circle.classList.add('bg-green-500');
                circle.innerHTML = '✓';
            } else {
                circle.classList.remove('bg-gray-300');
                circle.classList.add('bg-red-500');
                circle.innerHTML = '✗';
            }
        }

        function updateStatus(message) {
            document.getElementById('install-status').textContent = message;
        }

        function showError(message) {
            document.getElementById('error-text').textContent = message;
            document.getElementById('error-message').classList.remove('hidden');
            document.querySelector('.animate-spin').style.display = 'none';
        }

        // Start installation
        async function startInstallation() {
            try {
                updateStatus('Starting installation...');
                
                const response = await fetch('{{ route('setup.install.process') }}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    }
                });

                const data = await response.json();

                if (data.success) {
                    updateStatus('Installation completed successfully!');
                    
                    // Mark all steps as completed
                    steps.forEach(step => updateStep(step.id, true));
                    
                    // Redirect to complete page
                    setTimeout(() => {
                        window.location.href = data.redirect;
                    }, 1500);
                } else {
                    showError(data.message);
                    updateStep(steps[currentStep].id, false);
                }
            } catch (error) {
                showError('Installation failed: ' + error.message);
            }
        }

        // Start installation when page loads
        document.addEventListener('DOMContentLoaded', startInstallation);
    </script>
</body>
</html>