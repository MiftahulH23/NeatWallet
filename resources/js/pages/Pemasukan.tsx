import { DataTable, DataTableControls } from '@/components/data-table';
import { DataTableFilter } from '@/components/data-table/data-table-filter';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PemasukanType } from '@/types/data/PemasukanTypes';
import { Head, useForm, router } from '@inertiajs/react';
import { ColumnDef, FilterFnOption } from '@tanstack/react-table';
import { useState } from 'react';
import { toast } from 'sonner';

function getCurrentWeekRange() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const bulanIndo = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);

    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (6 - dayOfWeek));

    const formatDate = (date: Date) => {
        const d = date.getDate().toString().padStart(2, '0');
        const m = bulanIndo[date.getMonth()];
        const y = date.getFullYear();
        return `${d} ${m} ${y}`;
    };

    return { start: formatDate(startOfWeek), end: formatDate(endOfWeek) };
}

const Pemasukan = (props: { pemasukan: PemasukanType.Default[] }) => {
    const { pemasukan } = props;
    const { start, end } = getCurrentWeekRange();

    const { data, setData, post, processing, errors, reset } = useForm({ jumlah: '', tanggal: '', keterangan: '' });
    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors } = useForm({ jumlah: '', tanggal: '', keterangan: '' });

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPemasukan, setSelectedPemasukan] = useState<PemasukanType.Default | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [displayJumlah, setDisplayJumlah] = useState('');
    const [displayEditJumlah, setDisplayEditJumlah] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pemasukan.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setDisplayJumlah('');
                setIsAddModalOpen(false);
                toast.success('Pemasukan berhasil ditambahkan');
            },
            onError: () => {
                const message = Object.values(errors)[0];
                toast.error(message || 'Gagal, cek kembali inputan Anda');
            },
        });
    };

    const openEditModal = (pemasukan: PemasukanType.Default) => {
        setSelectedPemasukan(pemasukan);
        setEditData({ jumlah: String(pemasukan.jumlah), tanggal: pemasukan.tanggal, keterangan: pemasukan.keterangan });
        setDisplayEditJumlah(Number(pemasukan.jumlah).toLocaleString('id-ID'));
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPemasukan) return;

        put(route('pemasukan.update', selectedPemasukan.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditModalOpen(false);
                toast.success('Pemasukan berhasil diperbarui');
            },
            onError: () => {
                const message = Object.values(editErrors)[0];
                toast.error(message || 'Gagal, cek kembali inputan Anda');
            },
        });
    };

    const handleDelete = (id: string) => {
        router.delete(route('pemasukan.destroy', id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Pemasukan berhasil dihapus'),
            onError: () => toast.error('Gagal menghapus pemasukan'),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pemasukan', href: '/pemasukan' }];

    const columns: ColumnDef<PemasukanType.Default>[] = [
        { id: 'Nomor', header: 'No', cell: (info) => info.row.index + 1 },
        { accessorKey: 'jumlah', header: 'Jumlah Pemasukan', cell: ({ row }) => <span className="capitalize">Rp {Number(row.original.jumlah).toLocaleString('id-ID')}</span> },
        { accessorKey: 'tanggal', header: 'Tanggal', filterFn: 'date-range' as FilterFnOption<PemasukanType.Default> },
        { accessorKey: 'keterangan', header: 'Keterangan', cell: ({ row }) => row.original.keterangan ?? '-' },
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
            <Head title="Pemasukan" />
            <div className="container">
                <h1 className="mb-4">Pemasukan</h1>
                <DataTable columns={columns} data={pemasukan}>
                    {({ table }) => (
                        <DataTableControls table={table} action={<Button onClick={() => setIsAddModalOpen(true)}>Tambah</Button>} search>
                            <DataTableFilter table={table} />
                        </DataTableControls>
                    )}
                </DataTable>

                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogContent>
                        <h2>Tambah Pemasukan</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <div>
                                <Label>Jumlah Pemasukan</Label>
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
                                {errors.tanggal && <span className="text-sm text-red-500">{errors.tanggal}</span>}
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
                        <h2>Edit Pemasukan</h2>
                        <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
                            <div>
                                <Label>Jumlah Pemasukan</Label>
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
                        <p>Apakah Anda yakin ingin menghapus pemasukan ini?</p>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setDeleteId(null)}>Batal</Button>
                            <Button variant="destructive" onClick={() => { if (deleteId) handleDelete(deleteId); setDeleteId(null); }}>Hapus</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
};

export default Pemasukan;
