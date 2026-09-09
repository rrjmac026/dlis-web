<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('committee_report_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('committee_report_id')->constrained('committee_reports')->cascadeOnDelete();
            $table->string('file_name');
            $table->string('file_path');
            $table->timestamp('uploaded_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('committee_report_attachments');
    }
};