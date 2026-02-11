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
        Schema::create('payment_claims', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organisation_id');
            $table->string('payer_name');
            $table->decimal('amount', 10, 2);
            $table->enum('payment_mode', ['upi', 'bank', 'cash']);
            $table->string('upi_reference_id')->nullable();
            $table->string('screenshot')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->timestamp('verified_at')->nullable();
            $table->unsignedBigInteger('verified_by')->nullable();
            $table->string('submitter_ip', 45)->nullable();
            $table->string('submitter_user_agent', 500)->nullable();
            $table->timestamps();
            
            // Foreign key constraints
            $table->foreign('organisation_id')->references('id')->on('organisations')->onDelete('cascade');
            $table->foreign('verified_by')->references('id')->on('users')->onDelete('set null');
            
            // Indexes for performance
            $table->index(['organisation_id', 'status']);
            $table->index('status');
            $table->index('submitter_ip');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_claims');
    }
};