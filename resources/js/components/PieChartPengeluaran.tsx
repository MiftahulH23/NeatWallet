'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LabelList, Legend, Pie, PieChart } from 'recharts';

interface KategoriPengeluaran {
    kategori: string;
    total: number;
    fill: string;
}

interface ChartPiePengeluaranProps {
    pengeluaranByKategori: KategoriPengeluaran[];
}

const chartConfig: ChartConfig = {
    total: { label: 'Total' },
    kategori1: { label: 'Kategori 1', color: 'var(--chart-1)' },
    kategori2: { label: 'Kategori 2', color: 'var(--chart-2)' },
    kategori3: { label: 'Kategori 3', color: 'var(--chart-3)' },
    kategori4: { label: 'Kategori 4', color: 'var(--chart-4)' },
    kategori5: { label: 'Kategori 5', color: 'var(--chart-5)' },
};

export function ChartPiePengeluaran({ pengeluaranByKategori }: ChartPiePengeluaranProps) {
    const chartData = pengeluaranByKategori.map((item, index) => ({
        kategori: item.kategori,
        total: Number(item.total),
        fill: `var(--chart-${(index % 5) + 1})`,
    }));

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Diagram Kategori Pengeluaran</CardTitle>
                <CardDescription>Pengeluaran Mingguan Berdasarkan Kategori</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                >
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Pie data={chartData} dataKey="total" nameKey="kategori">
                            <LabelList dataKey="kategori" position="insideTop" />
                        </Pie>
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
