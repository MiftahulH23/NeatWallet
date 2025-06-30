export namespace PengeluaranType {
    export interface Default {
        id: string;
        jumlah: number;
        tanggal: string;
        keterangan: string;
        kategori_pengeluaran_id: string;
        kategori_pengeluaran?: {
            id: string;
            nama: string;
        };
    }
}
