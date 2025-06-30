<?php

use App\Http\Controllers\KategoriPengeluaranController;
use App\Http\Controllers\PemasukanMingguanController;
use App\Http\Controllers\PengeluaranHarianController;
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
    Route::resource('pemasukan-mingguan', PemasukanMingguanController::class)->only(['index', 'store', 'update', 'destroy']);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('kategori-pengeluaran', KategoriPengeluaranController::class)->only(['index', 'store', 'update', 'destroy']);
});


// Pengeluaran Harian Controller
Route::middleware(['auth', 'verified'])->prefix('pengeluaran-harian')->name('pengeluaran-harian.')->group(function () {
    Route::resource('/', PengeluaranHarianController::class)->only(['index', 'store', 'update', 'destroy']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
