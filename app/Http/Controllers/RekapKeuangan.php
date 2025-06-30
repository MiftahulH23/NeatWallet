<?php

namespace App\Http\Controllers;

use App\Models\Pemasukan;
use App\Models\Pengeluaran;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RekapKeuangan extends Controller
{
    public function rekapMingguan()
    {

        // Hitung range minggu ini: Minggu - Sabtu
        $now = Carbon::now();
        $startOfWeek = $now->copy()->startOfWeek(Carbon::SUNDAY);
        $endOfWeek = $now->copy()->endOfWeek(Carbon::SATURDAY);

        // Total pemasukan & pengeluaran dalam seminggu
        $totalPemasukan = Pemasukan::whereBetween('tanggal', [$startOfWeek, $endOfWeek])->sum('jumlah');
        $totalPengeluaran = Pengeluaran::whereBetween('tanggal', [$startOfWeek, $endOfWeek])->sum('jumlah');

        return Inertia::render('Rekap/RekapMingguan', [
            'totalPemasukan' => $totalPemasukan,
            'totalPengeluaran' => $totalPengeluaran,
            'start' => $startOfWeek->translatedFormat('d F Y'),
            'end' => $endOfWeek->translatedFormat('d F Y'),
        ]);
    }

    public function rekapBulanan()
    {
        // Implementasi rekap bulanan
        // ...
        // Contoh: Menghitung total pemasukan dan pengeluaran bulan ini
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        $totalPemasukan = Pemasukan::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->sum('jumlah');
        $totalPengeluaran = Pengeluaran::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->sum('jumlah');

        return Inertia::render('Rekap/RekapBulanan', [
            'totalPemasukan' => $totalPemasukan,
            'totalPengeluaran' => $totalPengeluaran,
            'start' => $startOfMonth->translatedFormat('d F Y'),
            'end' => $endOfMonth->translatedFormat('d F Y'),
        ]);
    }
}
