'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Video, Playlist } from '@/lib/types';
import { PlaylistImportCard } from '@/components/dashboard/playlist-import-card';
import { OverallProgressCard } from '@/components/dashboard/overall-progress-card';
import { PlaylistCard } from '@/components/dashboard/playlist-card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getPlaylistVideos } from '@/ai/flows/youtube';
import { useRequireAuth } from '@/hooks/use-auth';
import { db } from '@/firebase/client';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, loading: authLoading, isAdmin } = useRequireAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  
  const [watchedVideoIds, setWatchedVideoIds] = useState<Record<string, Set<string>>>({});
  const { toast } = useToast();

  const loadUserData = useCallback(async (userId: string) => {
    setIsLoading(true);
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      setPlaylists(data.playlists || []);
      const storedWatched = data.watchedVideoIds || {};
      const newWatched: Record<string, Set<string>> = {};
      for (const playlistId in storedWatched) {
        newWatched[playlistId] = new Set(storedWatched[playlistId]);
      }
      setWatchedVideoIds(newWatched);
    } else {
      // Create a document for new user
      await setDoc(userDocRef, { playlists: [], watchedVideoIds: {} });
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      loadUserData(user.uid);
    }
  }, [user, loadUserData]);

  const handleToggleWatched = useCallback(async (playlistId: string, videoId: string) => {
    if (!user) return;

    const newWatched = { ...watchedVideoIds };
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
    setWatchedVideoIds(newWatched);

    const userDocRef = doc(db, 'users', user.uid);
    const watchedForFirestore: Record<string, string[]> = {};
    for(const pId in newWatched) {
        watchedForFirestore[pId] = Array.from(newWatched[pId]);
    }

    await updateDoc(userDocRef, { watchedVideoIds: watchedForFirestore });

  }, [user, watchedVideoIds]);

  const handleImportPlaylist = async (url: string, name: string) => {
    if (!user) return;
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

    setIsImporting(true);
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

      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        playlists: arrayUnion(newPlaylist)
      });

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
      setIsImporting(false);
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
  
  if (authLoading || (isLoading && user)) {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-16 w-16 animate-spin" />
        </div>
    )
  }

  if (!user) {
    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <h1 className="text-2xl font-bold">Welcome to TrackTube</h1>
            <p>Please sign in to continue.</p>
            <Button asChild>
                <Link href="/login">Sign In</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <Alert>
          <AlertTitle>Welcome back, {user.displayName || user.email}!</AlertTitle>
          <AlertDescription>
            {isAdmin ? "You are an admin. You can add new playlists." : "Here's an overview of your YouTube playlist progress."}
          </AlertDescription>
        </Alert>

        <OverallProgressCard totalVideos={totalVideos} completedVideos={completedVideos} />

        {isAdmin && <PlaylistImportCard onImport={handleImportPlaylist} isLoading={isImporting} />}

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
