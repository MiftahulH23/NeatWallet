<?php

use App\Http\Controllers\KategoriPengeluaranController;
use App\Http\Controllers\PemasukanController;
use App\Http\Controllers\PengeluaranController;
use App\Http\Controllers\RekapKeuanganController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Pemasukan Mingguan Controller
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('pemasukan', PemasukanController::class)->only(['index', 'store', 'update', 'destroy']);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('kategori-pengeluaran', KategoriPengeluaranController::class)->only(['index', 'store', 'update', 'destroy']);
});


// Pengeluaran Harian Controller
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('pengeluaran', PengeluaranController::class)->only(['index', 'store', 'update', 'destroy']);
});

// Rekap Keuangan
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('rekap-mingguan', [RekapKeuanganController::class, 'rekapMingguan'])->name('rekap.mingguan');
    Route::get('rekap-bulanan', [RekapKeuanganController::class, 'rekapBulanan'])->name('rekap.bulanan');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
