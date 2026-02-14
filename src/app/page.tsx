'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Video, Playlist } from '@/lib/types';
import { PlaylistImportCard } from '@/components/dashboard/playlist-import-card';
import { OverallProgressCard } from '@/components/dashboard/overall-progress-card';
import { PlaylistCard } from '@/components/dashboard/playlist-card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getPlaylistVideos } from '@/ai/flows/youtube';


export default function DashboardPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [watchedVideoIds, setWatchedVideoIds] = useState<Record<string, Set<string>>>({});
  const { toast } = useToast();

  const handleToggleWatched = useCallback((playlistId: string, videoId: string) => {
    setWatchedVideoIds(prev => {
      const newWatched = { ...prev };
      if (!newWatched[playlistId]) {
        newWatched[playlistId] = new Set();
      }
      const playlistWatched = new Set(newWatched[playlistId]);
      if (playlistWatched.has(videoId)) {
        playlistWatched.delete(videoId);
      } else {
        playlistWatched.add(videoId);
      }
      newWatched[playlistId] = playlistWatched;
      return newWatched;
    });
  }, []);

  const handleImportPlaylist = async (url: string, name: string) => {
    const playlistIdRegex = /[?&]list=([^&]+)/;
    const match = url.match(playlistIdRegex);
    const playlistId = match ? match[1] : null;

    if (!playlistId) {
      toast({
        variant: 'destructive',
        title: 'Invalid URL',
        description: 'Please provide a valid YouTube playlist URL.',
      });
      return;
    }
    
    if (playlists.some(p => p.id === playlistId)) {
        toast({
            variant: 'default',
            title: 'Playlist Already Exists',
            description: `The playlist is already in your dashboard.`,
        });
        return;
    }

    setIsLoading(true);
    try {
      const playlistData = await getPlaylistVideos(playlistId);
      const videos = playlistData.videos;
      
      if (!videos || videos.length === 0) {
        toast({
            variant: 'destructive',
            title: 'Import Failed',
            description: 'Could not fetch playlist videos. The playlist may be empty, private, or the URL is incorrect.',
          });
        return;
      }

      const playlistName = name || playlistData.playlistTitle;

      const newPlaylist: Playlist = {
        id: playlistId,
        name: playlistName,
        videos: videos
      };

      setPlaylists(prev => [...prev, newPlaylist]);

      toast({
        title: 'Playlist Imported!',
        description: `The playlist "${playlistName}" has been successfully loaded.`,
      });

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description: error.message || 'An unexpected error occurred. Make sure your YouTube API key is set correctly.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { totalVideos, completedVideos } = useMemo(() => {
    let total = 0;
    let completed = 0;
    playlists.forEach(p => {
        total += p.videos.length;
        const watched = watchedVideoIds[p.id] || new Set();
        completed += watched.size;
    })
    return { totalVideos: total, completedVideos: completed };
  }, [playlists, watchedVideoIds]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <Alert>
          <AlertTitle>Welcome to TrackTube!</AlertTitle>
          <AlertDescription>
            To get started, add a YouTube playlist below. You will need a YouTube API key added to your .env file.
          </AlertDescription>
        </Alert>

        <OverallProgressCard totalVideos={totalVideos} completedVideos={completedVideos} />

        <PlaylistImportCard onImport={handleImportPlaylist} isLoading={isLoading} />

        {playlists.length > 0 && (
            <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Your Playlists</h2>
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {playlists.map(playlist => (
                        <PlaylistCard 
                            key={playlist.id}
                            playlist={playlist}
                            watchedVideoIds={watchedVideoIds[playlist.id] || new Set()}
                            onToggleWatched={handleToggleWatched}
                        />
                    ))}
                </div>
            </div>
        )}
    </div>
  );
}
