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
        Schema::create('meetings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organisation_id');
            $table->string('title');
            $table->enum('meeting_type', ['general', 'core', 'emergency'])->default('general');
            $table->date('meeting_date');
            $table->time('meeting_time');
            $table->string('location')->nullable();
            $table->text('agenda');
            $table->text('decisions')->nullable();
            $table->text('action_points')->nullable();
            $table->unsignedBigInteger('created_by');
            $table->timestamps();
            
            // Foreign key constraints
            $table->foreign('organisation_id')->references('id')->on('organisations')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            
            // Indexes for performance
            $table->index(['organisation_id', 'meeting_date']);
            $table->index('meeting_type');
            $table->index('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meetings');
    }
};