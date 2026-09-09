<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ordinance_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ordinance_id')->constrained('ordinances')->cascadeOnDelete();
            $table->unsignedInteger('version_number');
            $table->string('title');
            $table->longText('content');
            $table->date('date_enacted');
            $table->string('enacted_by');
            $table->text('amendment_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ordinance_versions');
    }
};