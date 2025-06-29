import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const PemasukanMingguan = () => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pemasukan Mingguan',
            href: '/pemasukan-mingguan',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pemasukan Mingguan" />
            <div className='container'>
                <h1>Pemasukan Mingguan</h1>
            </div>
        </AppLayout>
    );
};

export default PemasukanMingguan;
