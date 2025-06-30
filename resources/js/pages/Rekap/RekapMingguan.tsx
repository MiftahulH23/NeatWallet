import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import React from 'react';

const formatRupiah = (angka: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);

const RekapMingguan = (props: { totalPemasukan: number; totalPengeluaran: number; start: string; end: string }) => {
    const { totalPemasukan, totalPengeluaran, start, end } = props;

    const saldo = totalPemasukan - totalPengeluaran;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Rekap Mingguan',
            href: '/rekap-mingguan',
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rekap Mingguan" />
            <div className="container">
                <h1 className="text-2xl font-bold mb-4">Rekap Mingguan</h1>
                <p className="mb-4">Periode: <strong>{start}</strong> - <strong>{end}</strong></p>

               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Pemasukan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-bold">{formatRupiah(props.totalPemasukan)}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Total Pengeluaran</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-bold">{formatRupiah(props.totalPengeluaran)}</p>
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
            </div>
        </AppLayout>
    );
};

export default RekapMingguan;
