import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const PengeluaranHarian = () => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pengeluaran Harian',
            href: '/pengeluaran-harian',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengeluaran Harian" />
            <div className="cointainer">
                <h1>Pengeluaran Harian</h1>
            </div>
        </AppLayout>
    );
};

export default PengeluaranHarian;
