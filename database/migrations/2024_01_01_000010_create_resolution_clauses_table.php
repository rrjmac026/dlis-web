<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resolution_clauses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resolution_id')->constrained('resolutions')->cascadeOnDelete();
            $table->string('clause_type');
            $table->unsignedInteger('order')->default(0);
            $table->text('text');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resolution_clauses');
    }
};