'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    { name: 'Completed', value: completed, fill: 'var(--color-completed)' },
    { name: 'Remaining', value: remaining, fill: 'var(--color-remaining)' },
  ];

  const chartConfig = {
    completed: {
      label: 'Completed',
      color: 'hsl(var(--chart-1))',
    },
    remaining: {
      label: 'Remaining',
      color: 'hsl(var(--chart-2))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Overview</CardTitle>
        <CardDescription>
          You have completed {completed} of {total} videos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-[200px]"
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
                innerRadius={60}
                strokeWidth={5}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="absolute flex items-center justify-center">
            <span className="text-3xl font-bold">{percentage}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
