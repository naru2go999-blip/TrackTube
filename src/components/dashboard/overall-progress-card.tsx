'use client';

import { ProgressOverviewCard } from './progress-overview-card';
import { StatCard } from './stat-card';

type OverallProgressCardProps = {
  totalVideos: number;
  completedVideos: number;
};

export function OverallProgressCard({
  totalVideos,
  completedVideos,
}: OverallProgressCardProps) {
  const remainingVideos = totalVideos - completedVideos;
  const progressPercentage =
    totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
            <ProgressOverviewCard completed={completedVideos} total={totalVideos} />
        </div>
      <div className="md:col-span-2 grid grid-cols-2 gap-4">
        <StatCard title="Total Videos" value={totalVideos} />
        <StatCard title="Completed" value={completedVideos} />
        <StatCard title="Remaining" value={remainingVideos} />
        <StatCard title="Progress" value={`${progressPercentage}%`} />
      </div>
    </div>
  );
}
