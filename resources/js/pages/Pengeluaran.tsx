import { DataTable, DataTableControls } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { KategoriPengeluaranType } from '@/types/data/KategoriPengeluaranTypes';
import { PengeluaranType } from '@/types/data/PengeluaranTypes';
import { Head, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { toast } from 'sonner';

const Pengeluaran = (props: { pengeluaran: PengeluaranType.Default[]; kategoriPengeluaran: KategoriPengeluaranType.Default[] }) => {
    const { pengeluaran, kategoriPengeluaran } = props;
    const { data, setData, post, processing, errors, reset } = useForm({
        id: '',
        kategori_pengeluaran_id: '',
        jumlah: '',
        tanggal: '',
        keterangan: '',
    });
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pengeluaran',
            href: '/pengeluaran',
        },
    ];
    const column: ColumnDef<PengeluaranType.Default>[] = [
        {
            id: 'Nomor',
            header: 'No',
            cell: (info) => info.row.index + 1,
        },
        {
            id: 'Kategori',
            header: 'Kategori',
            cell: ({ row }) => <span>{row.original.kategori_pengeluaran?.nama ?? '-'}</span>,
        },
        {
            accessorKey: 'jumlah',
            header: 'Jumlah Pengeluaran',
            cell: ({ row }) => <span className="capitalize">Rp {Number(row.original.jumlah).toLocaleString('id-ID')}</span>,
        },
        {
            accessorKey: 'tanggal',
            header: 'Tanggal',
        },
        {
            accessorKey: 'keterangan',
            header: 'Keterangan',
        },
    ];
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pengeluaran.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setDisplayJumlah('');
                setIsAddModalOpen(false);
                toast.success('Pengeluaran berhasil ditambahkan');
            },
            onError: () => {
                const message = Object.values(errors)[0];
                toast.error('Gagal, cek kembali inputan Anda');
            },
        });
    };
    const [displayJumlah, setDisplayJumlah] = useState('');
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengeluaran " />
            <div className="container">
                <h1>Pengeluaran</h1>
                <div className="mt-4">
                    <DataTable columns={column} data={pengeluaran}>
                        {({ table }) => (
                            <DataTableControls
                                table={table}
                                action={
                                    <Button onClick={() => setIsAddModalOpen(true)} className="hover:cursor-pointer">
                                        Tambah
                                    </Button>
                                }
                            ></DataTableControls>
                        )}
                    </DataTable>
                </div>
            </div>

            {/* Modal Add */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent>
                    <h2>Tambah Pengeluaran</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="kategori_id">Kategori</Label>
                            <Select value={data.kategori_pengeluaran_id} onValueChange={(value) => setData('kategori_pengeluaran_id', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kategoriPengeluaran.map((kategori) => (
                                        <SelectItem key={kategori.id} value={kategori.id}>
                                            {kategori.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.kategori_pengeluaran_id && <span className="text-sm text-red-500">{errors.kategori_pengeluaran_id}</span>}
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="jumlah">Jumlah Pengeluaran</Label>
                            <Input
                                type="text"
                                id="jumlah"
                                name="jumlah"
                                placeholder="Masukkan jumlah pengeluaran"
                                value={displayJumlah}
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\./g, '').replace(/[^0-9]/g, '');

                                    // Update ke backend tetap angka polos
                                    setData('jumlah', rawValue);

                                    // Format tampilan ribuan
                                    const formatted = new Intl.NumberFormat('id-ID').format(Number(rawValue));
                                    setDisplayJumlah(formatted);
                                }}
                            />
                            {errors.jumlah && <span className="text-sm text-red-500">{errors.jumlah}</span>}
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="tanggal">Tanggal</Label>
                            <Input
                                type="date"
                                id="tanggal"
                                name="tanggal"
                                value={data.tanggal}
                                onChange={(e) => setData('tanggal', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="keterangan">Keterangan (opsional)</Label>
                            <Input
                                type="text"
                                id="keterangan"
                                name="keterangan"
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing} className="hover:cursor-pointer">
                                {processing ? 'Meyimpan' : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
};

export default Pengeluaran;
