<?php

namespace App\Http\Controllers;

use App\Models\KategoriPengeluaran;
use App\Models\Pengeluaran;
use App\Models\PengeluaranHarian;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengeluaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pengeluaran  = Pengeluaran::with('kategori_pengeluaran')->get();
        $kategoriPengeluaran = KategoriPengeluaran::select('id', 'nama')->get();
        return Inertia::render('Pengeluaran', [
            'pengeluaran' => $pengeluaran,
            'kategoriPengeluaran' => $kategoriPengeluaran,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kategori_pengeluaran_id' => 'required',
            'jumlah' => 'required|numeric|min:0',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string|max:255',
        ], [
            'kategori_pengeluaran_id.required' => 'Kategori pengeluaran harus dipilih.',
            'jumlah.required' => 'Jumlah pengeluaran harus diisi.',
            'jumlah.numeric' => 'Jumlah pengeluaran harus berupa angka.',
            'jumlah.min' => 'Jumlah pengeluaran tidak boleh kurang dari 0.',
            'tanggal.required' => 'Tanggal pengeluaran harus diisi.',
            'tanggal.date' => 'Tanggal pengeluaran harus berupa tanggal yang valid.',
        ]);
        // dd($validated);
        Pengeluaran::create($validated);
        return redirect()->back()->with('success', 'Pengeluaran harian berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
