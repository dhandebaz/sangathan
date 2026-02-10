<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Installation Status
    |--------------------------------------------------------------------------
    |
    | This value determines if the application has been installed.
    | When false, the setup wizard will be triggered automatically.
    |
    */
    'installed' => env('APP_INSTALLED', false),

    /*
    |--------------------------------------------------------------------------
    | Installation Lock File
    |--------------------------------------------------------------------------
    |
    | Path to the file that marks the application as installed.
    | This file is created after successful installation.
    |
    */
    'lock_file' => storage_path('installed'),

    /*
    |--------------------------------------------------------------------------
    | Setup Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for the setup wizard behavior.
    |
    */
    'setup' => [
        'min_password_length' => 8,
        'default_app_name' => 'Sangathan',
        'allowed_database_chars' => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_',
        'max_database_name_length' => 64,
    ],
];