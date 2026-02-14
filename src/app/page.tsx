'use client';

import { useState, useMemo } from 'react';
import { mockPlaylist } from '@/lib/data';
import type { Video } from '@/lib/types';
import { PlaylistImportCard } from '@/components/dashboard/playlist-import-card';
import { ProgressOverviewCard } from '@/components/dashboard/progress-overview-card';
import { RecommendationCard } from '@/components/dashboard/recommendation-card';
import { VideoListCard } from '@/components/dashboard/video-list-card';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const [playlist, setPlaylist] = useState<Video[]>(mockPlaylist);
  const [watchedVideoIds, setWatchedVideoIds] = useState<Set<string>>(new Set(['1', '3']));
  const { toast } = useToast();

  const handleToggleWatched = (videoId: string) => {
    setWatchedVideoIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const handleImportPlaylist = (url: string) => {
    // In a real app, you'd fetch the playlist from the URL.
    // For this demo, we'll just reload the mock playlist if the URL is "correct".
    if (url.includes('mock-playlist')) {
      setPlaylist(mockPlaylist);
      // Reset progress for the "new" playlist
      setWatchedVideoIds(new Set(['1', '3']));
      toast({
        title: 'Playlist Imported!',
        description: 'The mock playlist has been successfully loaded.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description: 'Only the mock playlist URL is supported in this demo.',
      });
    }
  };

  const { watchedVideos, unwatchedVideos } = useMemo(() => {
    const watchedList: Omit<Video, 'id' | 'thumbnailUrl' | 'duration'>[] = [];
    const unwatchedList: Omit<Video, 'id' | 'thumbnailUrl' | 'duration'>[] = [];
    playlist.forEach(video => {
      const plainVideo = {
        videoId: video.videoId,
        title: video.title,
        description: video.description,
      };
      if (watchedVideoIds.has(video.id)) {
        watchedList.push(plainVideo);
      } else {
        unwatchedList.push(plainVideo);
      }
    });
    return { watchedVideos: watchedList, unwatchedVideos: unwatchedList };
  }, [playlist, watchedVideoIds]);

  const totalVideos = playlist.length;
  const completedVideosCount = watchedVideoIds.size;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
       <header>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Here's your playlist progress and AI-powered next step.
          </p>
        </header>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <PlaylistImportCard onImport={handleImportPlaylist} />
          <VideoListCard
            videos={playlist}
            watchedVideoIds={watchedVideoIds}
            onToggleWatched={handleToggleWatched}
          />
        </div>
        <div className="space-y-6">
          <ProgressOverviewCard
            completed={completedVideosCount}
            total={totalVideos}
          />
          <RecommendationCard
            watchedVideos={watchedVideos}
            unwatchedVideos={unwatchedVideos}
            playlist={playlist}
          />
        </div>
      </div>
    </div>
  );
}
