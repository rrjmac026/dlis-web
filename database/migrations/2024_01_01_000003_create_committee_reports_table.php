<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('committee_reports', function (Blueprint $table) {
            $table->id();
            $table->string('report_number');
            $table->date('date')->nullable();
            $table->string('submitted_by')->nullable();
            $table->string('sponsored_by')->nullable();
            $table->string('subject')->nullable();
            $table->string('added_by')->nullable();
            $table->timestamp('added_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('committee_reports');
    }
};