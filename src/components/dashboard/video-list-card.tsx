'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import type { Video } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

type VideoListCardProps = {
  videos: Video[];
  watchedVideoIds: Set<string>;
  onToggleWatched: (videoId: string) => void;
  playlistName: string;
};

export function VideoListCard({
  videos,
  watchedVideoIds,
  onToggleWatched,
  playlistName,
}: VideoListCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{playlistName} Content</CardTitle>
        <CardDescription>
          Check the box next to videos you have watched.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {videos.map(video => (
              <div
                key={video.id}
                className="flex items-start gap-4 p-3 rounded-lg border transition-colors data-[watched=true]:bg-accent/50"
                data-watched={watchedVideoIds.has(video.id)}
              >
                <Checkbox
                  id={`video-${video.id}`}
                  checked={watchedVideoIds.has(video.id)}
                  onCheckedChange={() => onToggleWatched(video.id)}
                  className="mt-1 shrink-0"
                />
                <div className="grid gap-1.5 leading-none w-full">
                  <label
                    htmlFor={`video-${video.id}`}
                    className="flex items-start gap-4 cursor-pointer"
                  >
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      width={120}
                      height={68}
                      className="aspect-video rounded-md object-cover shrink-0"
                      data-ai-hint="video thumbnail"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{video.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {video.description}
                      </p>
                       <Badge variant="outline" className="mt-2 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {video.duration}
                      </Badge>
                    </div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
