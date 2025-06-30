import { DataTable, DataTableControls } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { KategoriPengeluaranType } from '@/types/data/KategoriPengeluaranTypes';
import { Head, router, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { toast } from 'sonner';

const KategoriPengeluaran = (props: { kategoriPengeluaran: KategoriPengeluaranType.Default[] }) => {
    const { kategoriPengeluaran } = props;

    const { data, setData, post, processing, errors, reset } = useForm({
        nama: '',
    });

    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
    } = useForm({
        nama: '',
    });

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedKategori, setSelectedKategori] = useState<KategoriPengeluaranType.Default | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('kategori-pengeluaran.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsAddModalOpen(false);
                toast.success('Kategori pengeluaran berhasil ditambahkan');
            },
            onError: () => {
                const message = Object.values(errors)[0];
                toast.error(message || 'Gagal, cek kembali inputan Anda');
            },
        });
    };

    const openEditModal = (kategori: KategoriPengeluaranType.Default) => {
        setSelectedKategori(kategori);
        setEditData({ nama: kategori.nama });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedKategori) return;

        put(route('kategori-pengeluaran.update', selectedKategori.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditModalOpen(false);
                toast.success('Kategori pengeluaran berhasil diubah');
            },
            onError: () => {
                const message = Object.values(editErrors)[0];
                toast.error(message || 'Gagal, cek kembali inputan Anda');
            },
        });
    };

    const handleDelete = (id: string) => {
        router.delete(route('kategori-pengeluaran.destroy', id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Kategori berhasil dihapus'),
            onError: () => toast.error('Gagal menghapus kategori'),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Kategori Pengeluaran', href: '/kategori-pengeluaran' }];

    const columns: ColumnDef<KategoriPengeluaranType.Default>[] = [
        { id: 'Nomor', header: 'No', cell: (info) => info.row.index + 1 },
        {
            accessorKey: 'nama',
            header: 'Nama Kategori',
            cell: ({ row }) => <span className="capitalize">{row.original.nama}</span>,
        },
        {
            id: 'Aksi',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => openEditModal(row.original)}>
                        Edit
                    </Button>
                    <Button variant="destructive" onClick={() => setDeleteId(row.original.id)}>
                        Hapus
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori Pengeluaran" />
            <div className="container">
                <h1 className="mb-4">Kategori Pengeluaran</h1>
                <DataTable columns={columns} data={kategoriPengeluaran}>
                    {({ table }) => (
                        <DataTableControls table={table}>
                            <Button onClick={() => setIsAddModalOpen(true)}>Tambah</Button>
                        </DataTableControls>
                    )}
                </DataTable>

                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogContent>
                        <h2>Tambah Kategori</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <div>
                                <Label htmlFor="nama">Nama Kategori</Label>
                                <Input
                                    id="nama"
                                    name="nama"
                                    type="text"
                                    placeholder="Masukkan nama kategori"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                />
                                {errors.nama && <span className="text-sm text-red-500">{errors.nama}</span>}
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent>
                        <h2>Edit Kategori</h2>
                        <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
                            <div>
                                <Label htmlFor="nama">Nama Kategori</Label>
                                <Input
                                    id="nama"
                                    name="nama"
                                    type="text"
                                    placeholder="Masukkan nama kategori"
                                    value={editData.nama}
                                    onChange={(e) => setEditData('nama', e.target.value)}
                                />
                                {editErrors.nama && <span className="text-sm text-red-500">{editErrors.nama}</span>}
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={editProcessing}>
                                    {editProcessing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                    <DialogContent>
                        <h2>Konfirmasi Hapus</h2>
                        <p>Apakah Anda yakin ingin menghapus kategori ini?</p>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setDeleteId(null)}>
                                Batal
                            </Button>
                            <Button
                                variant="destructive"
                                type="button"
                                onClick={() => {
                                    if (deleteId) handleDelete(deleteId);
                                    setDeleteId(null);
                                }}
                            >
                                Hapus
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
};

export default KategoriPengeluaran;
