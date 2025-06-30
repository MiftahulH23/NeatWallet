<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengeluaran extends BaseModel
{
    // Define the table associated with the model
    protected $table = 'pengeluaran';

    public function kategori_pengeluaran()
    {
        return $this->belongsTo(KategoriPengeluaran::class, 'kategori_pengeluaran_id');
    }


}
