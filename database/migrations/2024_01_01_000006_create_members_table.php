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
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organisation_id');
            $table->string('full_name');
            $table->string('phone_number');
            $table->string('role')->comment('Member role within the organisation');
            $table->string('area_or_district');
            $table->date('joining_date');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Foreign key constraint
            $table->foreign('organisation_id')->references('id')->on('organisations')->onDelete('cascade');
            
            // Indexes for performance
            $table->index(['organisation_id', 'status']);
            $table->index('phone_number');
            $table->index('full_name');
            
            // Unique constraint to prevent duplicate members within same organisation
            $table->unique(['organisation_id', 'phone_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};