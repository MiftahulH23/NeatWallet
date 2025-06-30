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
        Schema::create('pengeluaran_harian', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->integer('jumlah');
            $table->date('tanggal');
            $table->string('keterangan')->nullable(); // Optional field for description
            $table->uuid('kategori_pengeluaran_id');
            $table->foreign('kategori_pengeluaran_id')
                ->references('id')
                ->on('kategori_pengeluaran')
                ->onDelete('cascade'); // Ensure referential integrity
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengeluaran_harian');
    }
};
