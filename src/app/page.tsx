'use client';

import { useState, useMemo, useCallback } from 'react';
import { mockPlaylists, allMockVideos } from '@/lib/data';
import type { Video, Playlist } from '@/lib/types';
import { PlaylistImportCard } from '@/components/dashboard/playlist-import-card';
import { OverallProgressCard } from '@/components/dashboard/overall-progress-card';
import { PlaylistCard } from '@/components/dashboard/playlist-card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function DashboardPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists);
  
  const [watchedVideoIds, setWatchedVideoIds] = useState<Record<string, Set<string>>>(() => {
    // Initialize with some watched videos for the mock playlists
    return {
      'pl1': new Set(['1', '2']),
      'pl2': new Set(['4', '5']),
    };
  });
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

  const handleImportPlaylist = (url: string, name: string) => {
    if (url.includes('youtube.com/playlist')) {
        // Mock adding a new playlist
        const newPlaylist: Playlist = {
            id: `pl${playlists.length + 1}`,
            name: name,
            videos: allMockVideos.slice(6, 8) // just some mock videos for demo
        }
        setPlaylists(prev => [...prev, newPlaylist]);

      toast({
        title: 'Playlist Imported!',
        description: `The playlist "${name}" has been successfully loaded.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description: 'Please provide a valid YouTube playlist URL.',
      });
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
          <AlertDescription>
            Storage mode: Local browser storage (add Firebase config to enable cloud sync).
          </AlertDescription>
        </Alert>

        <OverallProgressCard totalVideos={totalVideos} completedVideos={completedVideos} />

        <PlaylistImportCard onImport={handleImportPlaylist} />

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
    </div>
  );
}
