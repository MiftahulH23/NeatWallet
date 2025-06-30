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
import { Head, useForm, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { toast } from 'sonner';

const Pengeluaran = (props: { pengeluaran: PengeluaranType.Default[]; kategoriPengeluaran: KategoriPengeluaranType.Default[] }) => {
    const { pengeluaran, kategoriPengeluaran } = props;

    const { data, setData, post, processing, errors, reset } = useForm({
        kategori_pengeluaran_id: '',
        jumlah: '',
        tanggal: '',
        keterangan: '',
    });

    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
    } = useForm({
        kategori_pengeluaran_id: '',
        jumlah: '',
        tanggal: '',
        keterangan: '',
    });

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPengeluaran, setSelectedPengeluaran] = useState<PengeluaranType.Default | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [displayJumlah, setDisplayJumlah] = useState('');
    const [displayEditJumlah, setDisplayEditJumlah] = useState('');

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
                toast.error(message || 'Gagal, cek kembali inputan Anda');
            },
        });
    };

    const openEditModal = (pengeluaran: PengeluaranType.Default) => {
        setSelectedPengeluaran(pengeluaran);
        setEditData({
            kategori_pengeluaran_id: pengeluaran.kategori_pengeluaran_id,
            jumlah: String(pengeluaran.jumlah),
            tanggal: pengeluaran.tanggal,
            keterangan: pengeluaran.keterangan,
        });
        setDisplayEditJumlah(Number(pengeluaran.jumlah).toLocaleString('id-ID'));
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPengeluaran) return;

        put(route('pengeluaran.update', selectedPengeluaran.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditModalOpen(false);
                toast.success('Pengeluaran berhasil diperbarui');
            },
            onError: () => {
                const message = Object.values(editErrors)[0];
                toast.error(message || 'Gagal, cek kembali inputan Anda');
            },
        });
    };

    const handleDelete = (id: string) => {
        router.delete(route('pengeluaran.destroy', id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Pengeluaran berhasil dihapus'),
            onError: () => toast.error('Gagal menghapus pengeluaran'),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pengeluaran', href: '/pengeluaran' }];

    const columns: ColumnDef<PengeluaranType.Default>[] = [
        { id: 'Nomor', header: 'No', cell: (info) => info.row.index + 1 },
        { id: 'Kategori', header: 'Kategori', cell: ({ row }) => <span>{row.original.kategori_pengeluaran?.nama ?? '-'}</span> },
        { accessorKey: 'jumlah', header: 'Jumlah Pengeluaran', cell: ({ row }) => <span className="capitalize">Rp {Number(row.original.jumlah).toLocaleString('id-ID')}</span> },
        { accessorKey: 'tanggal', header: 'Tanggal' },
        { accessorKey: 'keterangan', header: 'Keterangan' },
        {
            id: 'Aksi',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => openEditModal(row.original)}>Edit</Button>
                    <Button variant="destructive" onClick={() => setDeleteId(row.original.id)}>Hapus</Button>
                </div>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengeluaran" />
            <div className="container">
                <h1 className="mb-4">Pengeluaran</h1>
                <DataTable columns={columns} data={pengeluaran}>
                    {({ table }) => (
                        <DataTableControls table={table} action={<Button onClick={() => setIsAddModalOpen(true)}>Tambah</Button>} />
                    )}
                </DataTable>

                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogContent>
                        <h2>Tambah Pengeluaran</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <div>
                                <Label>Kategori</Label>
                                <Select value={data.kategori_pengeluaran_id} onValueChange={(value) => setData('kategori_pengeluaran_id', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kategoriPengeluaran.map((kategori) => (
                                            <SelectItem key={kategori.id} value={kategori.id}>{kategori.nama}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.kategori_pengeluaran_id && <span className="text-sm text-red-500">{errors.kategori_pengeluaran_id}</span>}
                            </div>
                            <div>
                                <Label>Jumlah Pengeluaran</Label>
                                <Input type="text" value={displayJumlah} onChange={(e) => {
                                    const raw = e.target.value.replace(/\./g, '').replace(/[^0-9]/g, '');
                                    setData('jumlah', raw);
                                    setDisplayJumlah(new Intl.NumberFormat('id-ID').format(Number(raw)));
                                }} />
                                {errors.jumlah && <span className="text-sm text-red-500">{errors.jumlah}</span>}
                            </div>
                            <div>
                                <Label>Tanggal</Label>
                                <Input type="date" value={data.tanggal} onChange={(e) => setData('tanggal', e.target.value)} />
                            </div>
                            <div>
                                <Label>Keterangan (opsional)</Label>
                                <Input type="text" value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan'}</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent>
                        <h2>Edit Pengeluaran</h2>
                        <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
                            <div>
                                <Label>Kategori</Label>
                                <Select value={editData.kategori_pengeluaran_id} onValueChange={(value) => setEditData('kategori_pengeluaran_id', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kategoriPengeluaran.map((kategori) => (
                                            <SelectItem key={kategori.id} value={kategori.id}>{kategori.nama}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editErrors.kategori_pengeluaran_id && <span className="text-sm text-red-500">{editErrors.kategori_pengeluaran_id}</span>}
                            </div>
                            <div>
                                <Label>Jumlah Pengeluaran</Label>
                                <Input type="text" value={displayEditJumlah} onChange={(e) => {
                                    const raw = e.target.value.replace(/\./g, '').replace(/[^0-9]/g, '');
                                    setEditData('jumlah', raw);
                                    setDisplayEditJumlah(new Intl.NumberFormat('id-ID').format(Number(raw)));
                                }} />
                                {editErrors.jumlah && <span className="text-sm text-red-500">{editErrors.jumlah}</span>}
                            </div>
                            <div>
                                <Label>Tanggal</Label>
                                <Input type="date" value={editData.tanggal} onChange={(e) => setEditData('tanggal', e.target.value)} />
                            </div>
                            <div>
                                <Label>Keterangan (opsional)</Label>
                                <Input type="text" value={editData.keterangan} onChange={(e) => setEditData('keterangan', e.target.value)} />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={editProcessing}>{editProcessing ? 'Menyimpan...' : 'Simpan'}</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                    <DialogContent>
                        <h2>Konfirmasi Hapus</h2>
                        <p>Apakah Anda yakin ingin menghapus pengeluaran ini?</p>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setDeleteId(null)}>Batal</Button>
                            <Button variant="destructive" onClick={() => {
                                if (deleteId) handleDelete(deleteId);
                                setDeleteId(null);
                            }}>Hapus</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
};

export default Pengeluaran;
