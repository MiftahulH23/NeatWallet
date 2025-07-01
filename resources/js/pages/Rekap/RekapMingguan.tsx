import { DataTable, DataTableControls } from '@/components/data-table';
import { DataTableFilter } from '@/components/data-table/data-table-filter';
import { ChartPiePengeluaran } from '@/components/PieChartPengeluaran';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnDef, FilterFnOption } from '@tanstack/react-table';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const formatRupiah = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#8dd1e1', '#d0ed57', '#a4de6c'];

interface Pengeluaran {
    id: number;
    tanggal: string;
    jumlah: number;
    keterangan: string;
    kategori: string;
}

interface KategoriPengeluaran {
    kategori: string;
    total: number;
    fill: string;
}

interface RekapMingguanProps {
    totalPemasukan: number;
    totalPengeluaran: number;
    start: string;
    end: string;
    pengeluaranMingguan: Pengeluaran[];
    pengeluaranByKategori: KategoriPengeluaran[];
}

const RekapMingguan = (props: RekapMingguanProps) => {
    const { totalPemasukan, totalPengeluaran, start, end, pengeluaranMingguan, pengeluaranByKategori } = props;

    const saldo = totalPemasukan - totalPengeluaran;

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Rekap Mingguan', href: '/rekap-mingguan' }];

    const columns: ColumnDef<Pengeluaran>[] = [
        { id: 'Nomor', header: 'No', cell: (info) => info.row.index + 1 },
        { accessorKey: 'tanggal', header: 'Tanggal', filterFn: 'date-range' as FilterFnOption<Pengeluaran> },
        { accessorKey: 'kategori', header: 'Kategori' },
        {
            accessorKey: 'jumlah',
            header: 'Jumlah Pengeluaran',
            cell: ({ row }) => <span>Rp {Number(row.original.jumlah).toLocaleString('id-ID')}</span>,
        },
        { accessorKey: 'keterangan', header: 'Keterangan', cell: ({ row }) => row.original.keterangan ?? '-' },
    ];
    console.log(pengeluaranByKategori);
    

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rekap Mingguan" />
            <div className="container">
                <h1 className="mb-4 text-2xl font-bold">Rekap Mingguan</h1>
                <p className="mb-4">
                    Periode: <strong>{start}</strong> - <strong>{end}</strong>
                </p>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Pemasukan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-bold">{formatRupiah(totalPemasukan)}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Total Pengeluaran</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-bold">{formatRupiah(totalPengeluaran)}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Saldo Akhir</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-bold">{formatRupiah(saldo)}</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Detail Pengeluaran Mingguan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={columns} data={pengeluaranMingguan}>
                                {({ table }) => (
                                    <DataTableControls table={table} search>
                                        <DataTableFilter table={table} />
                                    </DataTableControls>
                                )}
                            </DataTable>
                        </CardContent>
                    </Card>
                    <ChartPiePengeluaran pengeluaranByKategori={pengeluaranByKategori} />
                </div>
            </div>
        </AppLayout>
    );
};

export default RekapMingguan;
