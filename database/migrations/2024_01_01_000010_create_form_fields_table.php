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
        Schema::create('form_fields', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('form_id');
            $table->string('label');
            $table->enum('field_type', ['text', 'textarea', 'email', 'phone', 'number', 'dropdown', 'checkbox', 'date', 'file']);
            $table->json('options')->nullable(); // For dropdown/checkbox options
            $table->boolean('is_required')->default(false);
            $table->integer('position')->default(0);
            $table->timestamps();
            
            // Foreign key constraint
            $table->foreign('form_id')->references('id')->on('forms')->onDelete('cascade');
            
            // Indexes for performance
            $table->index('form_id');
            $table->index(['form_id', 'position']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_fields');
    }
};