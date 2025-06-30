<?php

namespace App\Http\Controllers;

use App\Models\Pemasukan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PemasukanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pemasukan = Pemasukan::all();
        return Inertia::render('Pemasukan', [
            'pemasukan' => $pemasukan,
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
            'jumlah' => 'required|numeric',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string|max:255',
        ],[
            'jumlah.required' => 'Jumlah pemasukan harus diisi.',
            'jumlah.numeric' => 'Jumlah pemasukan harus berupa angka.',
            'tanggal.required' => 'Tanggal pemasukan harus diisi.',
            'tanggal.date' => 'Tanggal pemasukan harus berupa tanggal yang valid.',
            'keterangan.string' => 'Keterangan harus berupa teks.',
            'keterangan.max' => 'Keterangan tidak boleh lebih dari 255 karakter.',
        ]);

        Pemasukan::create($validated);

        return redirect()->route('pemasukan.index')->with('success', 'Pemasukan Mingguan berhasil ditambahkan.');
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
