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
        Schema::create('form_submissions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('form_id');
            $table->timestamp('submitted_at');
            $table->string('submitter_ip', 45)->nullable(); // IPv6 compatible
            $table->string('submitter_user_agent', 500)->nullable();
            $table->timestamps();
            
            // Foreign key constraint
            $table->foreign('form_id')->references('id')->on('forms')->onDelete('cascade');
            
            // Indexes for performance
            $table->index('form_id');
            $table->index('submitted_at');
            $table->index('submitter_ip');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_submissions');
    }
};