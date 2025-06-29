<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pemasukan_mingguan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->integer('amount');
            $table->date('tanggal');
            $table->string('keterangan')->nullable(); // Optional field for description
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pemasukan_mingguan');
    }
};
