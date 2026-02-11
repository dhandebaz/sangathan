<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('organisation_payment_profiles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organisation_id');
            
            // Bank Details
            $table->string('account_holder_name')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('ifsc_code')->nullable();
            $table->string('branch')->nullable();
            
            // UPI Details
            $table->string('upi_id')->nullable();
            $table->string('upi_qr_image')->nullable();
            
            $table->timestamps();
            
            // Foreign key constraint
            $table->foreign('organisation_id')->references('id')->on('organisations')->onDelete('cascade');
            
            // Ensure one profile per organisation
            $table->unique('organisation_id');
            
            // Indexes for performance
            $table->index('organisation_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organisation_payment_profiles');
    }
};