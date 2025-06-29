<?php

namespace App\Http\Controllers;

use App\Models\PemasukanMingguan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PemasukanMingguanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pemasukanMingguan = PemasukanMingguan::all();
        return Inertia::render('PemasukanMingguan', [
            'pemasukanMingguan' => $pemasukanMingguan,
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
            'amount' => 'required|numeric',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string|max:255',
        ],[
            'amount.required' => 'Jumlah pemasukan harus diisi.',
            'amount.numeric' => 'Jumlah pemasukan harus berupa angka.',
            'tanggal.required' => 'Tanggal pemasukan harus diisi.',
            'tanggal.date' => 'Tanggal pemasukan harus berupa tanggal yang valid.',
            'keterangan.string' => 'Keterangan harus berupa teks.',
            'keterangan.max' => 'Keterangan tidak boleh lebih dari 255 karakter.',
        ]);

        PemasukanMingguan::create($validated);

        return redirect()->route('pemasukan-mingguan.index')->with('success', 'Pemasukan Mingguan berhasil ditambahkan.');
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
