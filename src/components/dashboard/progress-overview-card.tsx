'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';

type ProgressOverviewCardProps = {
  completed: number;
  total: number;
};

export function ProgressOverviewCard({
  completed,
  total,
}: ProgressOverviewCardProps) {
  const remaining = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const chartData = [
    { name: 'Completed', value: completed, fill: 'hsl(var(--chart-1))' },
    { name: 'Remaining', value: remaining, fill: 'hsl(var(--chart-5))' },
  ];

  const chartConfig = {
    completed: {
      label: 'Completed',
      color: 'hsl(var(--chart-1))',
    },
    remaining: {
      label: 'Remaining',
      color: 'hsl(var(--chart-5))',
    },
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-card rounded-lg border">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[150px] w-full mt-4"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              strokeWidth={5}
              startAngle={90}
              endAngle={450}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} className="outline-none" />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      <div className="flex flex-col gap-1 items-center text-center p-4">
          <span className="text-4xl font-bold">{percentage}%</span>
          <span className="text-sm text-muted-foreground">Overall Progress</span>
        </div>
    </div>
  );
}
