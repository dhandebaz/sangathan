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
        Schema::table('organisations', function (Blueprint $table) {
            if (!Schema::hasColumn('organisations', 'is_supporter')) {
                $table->boolean('is_supporter')->default(false)->after('is_active');
            }
            if (!Schema::hasColumn('organisations', 'supporter_since')) {
                $table->dateTime('supporter_since')->nullable()->after('is_supporter');
            }
            if (!Schema::hasColumn('organisations', 'branding_disabled')) {
                $table->boolean('branding_disabled')->default(false)->after('supporter_since');
            }
            if (!Schema::hasColumn('organisations', 'razorpay_customer_id')) {
                $table->string('razorpay_customer_id')->nullable()->after('branding_disabled');
            }
            if (!Schema::hasColumn('organisations', 'razorpay_subscription_id')) {
                $table->string('razorpay_subscription_id')->nullable()->after('razorpay_customer_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('organisations', function (Blueprint $table) {
            $table->dropColumn([
                'is_supporter',
                'supporter_since',
                'branding_disabled',
                'razorpay_customer_id',
                'razorpay_subscription_id',
            ]);
        });
    }
};
