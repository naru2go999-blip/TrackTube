'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import type { Playlist } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ExternalLink } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"


type PlaylistCardProps = {
  playlist: Playlist;
  watchedVideoIds: Set<string>;
  onToggleWatched: (playlistId: string, videoId: string) => void;
};

export function PlaylistCard({
  playlist,
  watchedVideoIds,
  onToggleWatched,
}: PlaylistCardProps) {
    const completedCount = playlist.videos.filter(v => watchedVideoIds.has(v.id)).length;
    const totalCount = playlist.videos.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{playlist.name}</CardTitle>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-sm font-medium">{completedCount} / {totalCount} Completed</p>
            </div>
            <Progress value={progress} />
          </div>
          <div className="space-y-2">
            {playlist.videos.map(video => (
              <div
                key={video.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-accent"
              >
                <div className="flex items-center gap-3">
                    <Checkbox
                    id={`video-${playlist.id}-${video.id}`}
                    checked={watchedVideoIds.has(video.id)}
                    onCheckedChange={() => onToggleWatched(playlist.id, video.id)}
                    className="shrink-0"
                    />
                    <label
                    htmlFor={`video-${playlist.id}-${video.id}`}
                    className="text-sm font-medium cursor-pointer"
                    >
                    {video.title}
                    </label>
                </div>
                <Button variant="ghost" size="icon" asChild>
                    <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
