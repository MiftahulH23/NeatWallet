<?php

namespace App\Http\Controllers;

use App\Models\Pemasukan;
use App\Models\Pengeluaran;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RekapKeuanganController extends Controller
{
    public function rekapMingguan()
    {
        $now = Carbon::now();
        $startOfWeek = $now->copy()->startOfWeek(Carbon::SUNDAY);
        $endOfWeek = $now->copy()->endOfWeek(Carbon::SATURDAY);

        $totalPemasukan = Pemasukan::whereBetween('tanggal', [$startOfWeek, $endOfWeek])->sum('jumlah');
        $totalPengeluaran = Pengeluaran::whereBetween('tanggal', [$startOfWeek, $endOfWeek])->sum('jumlah');

        $pengeluaranMingguan = Pengeluaran::with('kategori_pengeluaran')
            ->whereBetween('tanggal', [$startOfWeek, $endOfWeek])
            ->orderBy('tanggal', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'tanggal' => Carbon::parse($item->tanggal)->format('Y-m-d'),
                    'jumlah' => $item->jumlah,
                    'keterangan' => $item->keterangan,
                    'kategori' => $item->kategori_pengeluaran->nama ?? 'Lainnya',
                ];
            });

        // Group kategori
        $pengeluaranByKategori = Pengeluaran::selectRaw('kategori_pengeluaran_id, SUM(jumlah) as total')
            ->whereBetween('tanggal', [$startOfWeek, $endOfWeek])
            ->groupBy('kategori_pengeluaran_id')
            ->with('kategori_pengeluaran')
            ->get()
            ->map(function ($item) {
                return [
                    'kategori' => $item->kategori_pengeluaran->nama ?? 'Lainnya',
                    'total' => $item->total,
                ];
            });

        return Inertia::render('Rekap/RekapMingguan', [
            'totalPemasukan' => $totalPemasukan,
            'totalPengeluaran' => $totalPengeluaran,
            'start' => $startOfWeek->translatedFormat('d F Y'),
            'end' => $endOfWeek->translatedFormat('d F Y'),
            'pengeluaranMingguan' => $pengeluaranMingguan,
            'pengeluaranByKategori' => $pengeluaranByKategori,
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
