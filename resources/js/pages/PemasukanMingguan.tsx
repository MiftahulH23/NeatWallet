import { DataTable, DataTableControls } from '@/components/data-table';
import { DataTableFilter } from '@/components/data-table/data-table-filter';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PemasukanMingguanType } from '@/types/data/PemasukanMingguanTypes';
import { Head, useForm } from '@inertiajs/react';
import { ColumnDef, FilterFnOption } from '@tanstack/react-table';
import { useState } from 'react';
import { toast } from 'sonner';

function getCurrentWeekRange() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu

    const bulanIndo = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    // Awal minggu: Minggu
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);

    // Akhir minggu: Sabtu
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (6 - dayOfWeek));

    const formatDate = (date: Date) => {
        const d = date.getDate().toString().padStart(2, '0');
        const m = bulanIndo[date.getMonth()];
        const y = date.getFullYear();
        return `${d} ${m} ${y}`;
    };

    return {
        start: formatDate(startOfWeek),
        end: formatDate(endOfWeek),
    };
}

const PemasukanMingguan = (props: { pemasukanMingguan: PemasukanMingguanType.Default[] }) => {
    const { pemasukanMingguan } = props;
    const { start, end } = getCurrentWeekRange();

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        tanggal: '',
        keterangan: '', // Optional field for description
    });

    const columns: ColumnDef<PemasukanMingguanType.Default>[] = [
       {
            id: "Nomor",
            header: 'No',
            cell: (info) => info.row.index + 1,
        },
        {
            accessorKey: 'amount',
            header: 'Jumlah Pemasukan',
            cell: ({ row }) => <span className="capitalize">Rp {Number(row.original.amount).toLocaleString('id-ID')}</span>,
        },
        {
            accessorKey: 'tanggal',
            header: 'Tanggal',
            cell: ({ row }) => row.original.tanggal,
            filterFn: 'date-range' as FilterFnOption<PemasukanMingguanType.Default>,
        },
        {
            accessorKey: 'keterangan',
            header: 'Keterangan',
            cell: ({ row }) => row.original.keterangan ?? '-',
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pemasukan-mingguan.store'), {
            onSuccess: () => {
                reset();
                setIsAddModalOpen(false);
                toast.success('Pemasukan Mingguan berhasil ditambahkan.');
            },
            onError: (errors) => {
                const message = Object.values(errors)[0];
                toast.error('Gagal, Cek kembali inputan anda');
            },
        });
    };
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pemasukan Mingguan',
            href: '/pemasukan-mingguan',
        },
    ];
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pemasukan Mingguan" />
            <div className="container">
                <h1 className="mb-4">Pemasukan Mingguan</h1>
                <DataTable columns={columns} data={pemasukanMingguan}>
                    {({ table }) => (
                        <DataTableControls table={table} action={<Button onClick={() => setIsAddModalOpen(true)} className='hover:cursor-pointer'>Tambah</Button>} search>
                            <DataTableFilter table={table} />
                        </DataTableControls>
                    )}
                </DataTable>
            </div>
            {/* Modal Add */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent>
                    <h2>Tambah Pemasukan Mingguan</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="amount">Jumlah Pemasukan</Label>
                            <Input
                                id="amount"
                                type="number"
                                name="amount"
                                placeholder="Masukkan jumlah pemasukan"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                            />
                            {errors.amount && <span className="text-sm text-red-500">{errors.amount}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="tanggal">Tanggal</Label>
                            <Input
                                id="tanggal"
                                type="date"
                                name="tanggal"
                                min={start}
                                max={end}
                                value={data.tanggal}
                                onChange={(e) => setData('tanggal', e.target.value)}
                            />
                            <p className="text-sm text-muted-foreground">
                                Pastikan tanggal diinputkan dari <strong>{start}</strong> sampai <strong>{end}</strong>
                            </p>
                            {errors.tanggal && <span className="text-sm text-red-500">{errors.tanggal}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="keterangan">Keterangan</Label>
                            <Input
                                id="keterangan"
                                type="text"
                                name="keterangan"
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                            />
                            {errors.keterangan && <span className="text-sm text-red-500">{errors.keterangan}</span>}
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing} className='cursor-pointer'>
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
};

export default PemasukanMingguan;
