'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Sparkles } from 'lucide-react';
import type { Video } from '@/lib/types';
import { getRecommendationAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { recommendNextPlaylistVideo } from '@/ai/flows/recommend-next-playlist-video';

type RecommendationCardProps = {
  watchedVideos: Omit<Video, 'id' | 'thumbnailUrl' | 'duration'>[];
  unwatchedVideos: Omit<Video, 'id' | 'thumbnailUrl' | 'duration'>[];
  playlist: Video[];
};

type Recommendation = {
  video: Video;
  reasoning: string;
};

export function RecommendationCard({
  watchedVideos,
  unwatchedVideos,
  playlist,
}: RecommendationCardProps) {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetRecommendation = async () => {
    if (watchedVideos.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Not enough data',
        description: 'Watch at least one video to get a recommendation.',
      });
      return;
    }
    if (unwatchedVideos.length === 0) {
      toast({
        variant: 'default',
        title: 'Playlist Complete!',
        description: "You've watched all the videos!",
      });
      return;
    }

    setIsLoading(true);
    setRecommendation(null);
    const result = await getRecommendationAction({
      watchedVideos,
      unwatchedVideos,
    });
    setIsLoading(false);

    if (result.success && result.data) {
      const recommendedVideo = playlist.find(
        v => v.videoId === result.data.recommendedVideoId
      );
      if (recommendedVideo) {
        setRecommendation({
          video: recommendedVideo,
          reasoning: result.data.reasoning,
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Recommendation Failed',
        description: result.error,
      });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      );
    }

    if (recommendation) {
      return (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg">
            <Image
              src={recommendation.video.thumbnailUrl}
              alt={recommendation.video.title}
              width={320}
              height={180}
              className="w-full object-cover transition-transform hover:scale-105"
              data-ai-hint="video thumbnail"
            />
          </div>
          <div>
            <h3 className="font-semibold">{recommendation.video.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 bg-accent/50 p-3 rounded-md border border-dashed">
              <Lightbulb className="w-4 h-4 inline-block mr-2 text-primary" />
              {recommendation.reasoning}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center text-muted-foreground p-4">
        <Sparkles className="mx-auto h-10 w-10 mb-2" />
        <p>Click the button to get your next video recommendation.</p>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" />
          <span>Next Up</span>
        </CardTitle>
        <CardDescription>
          Your AI-powered next video recommendation.
        </CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
      <CardFooter>
        <Button
          onClick={handleGetRecommendation}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Thinking...' : 'Recommend Next Video'}
        </Button>
      </CardFooter>
    </Card>
  );
}
