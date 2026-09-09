<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resolutions', function (Blueprint $table) {
            $table->id();
            $table->string('resolution_number');
            $table->string('sb_term')->nullable();
            $table->string('session_info')->nullable();
            $table->string('committee')->nullable();
            $table->string('title');
            $table->string('sponsor')->nullable();
            $table->date('date_approved')->nullable();
            $table->string('affirmative_votes')->nullable();
            $table->string('negative_votes')->default('None');
            $table->string('abstained_votes')->default('None');
            $table->string('absent_votes')->default('None');
            $table->string('certified_adopted_by')->nullable();
            $table->date('certified_date')->nullable();
            $table->string('verified_by')->nullable();
            $table->date('verified_date')->nullable();
            $table->string('attested_by')->nullable();
            $table->date('attested_date')->nullable();
            $table->string('document_path')->nullable();
            $table->string('added_by')->nullable();
            $table->timestamp('added_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resolutions');
    }
};