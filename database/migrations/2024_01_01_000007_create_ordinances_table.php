<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ordinances', function (Blueprint $table) {
            $table->id();
            $table->string('ordinance_number');
            $table->string('series_number')->nullable();
            $table->string('title');
            $table->string('subject')->nullable();
            $table->string('type');
            $table->string('status');
            $table->string('sponsor')->nullable();
            $table->string('committee')->nullable();
            $table->date('date_passed')->nullable();
            $table->date('date_approved')->nullable();
            $table->date('date_published')->nullable();
            $table->string('document_path')->nullable();
            $table->string('reference_number')->nullable();
            $table->string('nrs_nsb')->nullable();
            $table->string('nomenclature')->nullable();
            $table->string('final_action')->nullable();
            $table->string('location')->nullable();
            $table->string('state')->nullable();
            $table->string('added_by')->nullable();
            $table->timestamp('added_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ordinances');
    }
};