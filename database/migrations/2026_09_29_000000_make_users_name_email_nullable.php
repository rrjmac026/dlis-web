<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $schema = Schema::connection('mysql');

        if (! $schema->hasTable('users')) {
            return;
        }

        $hasName  = $schema->hasColumn('users', 'name');
        $hasEmail = $schema->hasColumn('users', 'email');

        $schema->table('users', function (Blueprint $table) use ($hasName, $hasEmail) {
            if ($hasName) {
                $table->string('name')->nullable()->change();
            }
            if ($hasEmail) {
                $table->string('email')->nullable()->change();
            }
        });
    }

    public function down(): void
    {
        // Intentionally empty: this only relaxes local-testing constraints.
    }
};