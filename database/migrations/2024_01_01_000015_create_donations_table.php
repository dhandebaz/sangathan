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
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organisation_id');
            $table->string('donor_name');
            $table->decimal('amount', 10, 2);
            $table->enum('payment_mode', ['upi', 'bank', 'cash']);
            $table->string('reference_number')->nullable();
            $table->text('notes')->nullable();
            $table->date('donation_date');
            $table->string('source')->default('manual'); // manual, payment_claim, etc.
            $table->unsignedBigInteger('claim_id')->nullable(); // Link to payment claim if applicable
            $table->timestamps();
            
            // Foreign key constraints
            $table->foreign('organisation_id')->references('id')->on('organisations')->onDelete('cascade');
            $table->foreign('claim_id')->references('id')->on('payment_claims')->onDelete('set null');
            
            // Indexes for performance
            $table->index(['organisation_id', 'donation_date']);
            $table->index('payment_mode');
            $table->index('source');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};