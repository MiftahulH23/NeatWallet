<?php

use App\Http\Controllers\PemasukanMingguanController;
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
Route::middleware(['auth', 'verified'])->prefix('pemasukan-mingguan')->name('pemasukan-mingguan.')->group(function () {
    Route::resource('/', PemasukanMingguanController::class)->only(['index', 'store', 'update', 'destroy']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
