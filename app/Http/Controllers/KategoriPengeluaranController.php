<?php

namespace App\Http\Controllers;

use App\Models\KategoriPengeluaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KategoriPengeluaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kategoriPengeluaran = KategoriPengeluaran::all();
        return Inertia::render('KategoriPengeluaran', ['kategoriPengeluaran' => $kategoriPengeluaran]);
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
            'nama' => 'required|string|max:255',
        ], [
            'nama.required' => 'Nama kategori pengeluaran harus diisi.',
            'nama.string' => 'Nama kategori pengeluaran harus berupa teks.',
            'nama.max' => 'Nama kategori pengeluaran tidak boleh lebih dari 255 karakter.',
        ]);

        KategoriPengeluaran::create($validated);
        return redirect()->back()->with('success', 'Kategori pengeluaran berhasil ditambahkan.');
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
    public function update(Request $request, $id)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
        ]);

        $kategori = KategoriPengeluaran::findOrFail($id); // UUID tetap bisa dipakai findOrFail
        $kategori->update([
            'nama' => $request->nama,
        ]);

        return to_route('kategori-pengeluaran.index')->with('success', 'Kategori berhasil diubah');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $kategori = KategoriPengeluaran::findOrFail($id);
        $kategori->delete();

        return back()->with('success', 'Kategori pengeluaran berhasil dihapus.');
    }
}
