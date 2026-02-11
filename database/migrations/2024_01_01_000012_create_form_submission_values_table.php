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
        Schema::create('form_submission_values', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('submission_id');
            $table->unsignedBigInteger('field_id');
            $table->text('value')->nullable();
            $table->timestamps();
            
            // Foreign key constraints
            $table->foreign('submission_id')->references('id')->on('form_submissions')->onDelete('cascade');
            $table->foreign('field_id')->references('id')->on('form_fields')->onDelete('cascade');
            
            // Indexes for performance
            $table->index('submission_id');
            $table->index('field_id');
            $table->unique(['submission_id', 'field_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_submission_values');
    }
};