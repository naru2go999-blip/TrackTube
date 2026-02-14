'use server';
/**
 * @fileOverview A flow for interacting with the YouTube API.
 *
 * - getPlaylistVideos - Fetches all videos from a given YouTube playlist ID.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Video } from '@/lib/types';

// This is a subset of the YouTube API playlist item.
// See: https://developers.google.com/youtube/v3/docs/playlistItems#resource
const YoutubePlaylistItemSchema = z.object({
  snippet: z.object({
    title: z.string(),
    description: z.string(),
    thumbnails: z
      .object({
        high: z.object({ url: z.string() }).optional(),
        medium: z.object({ url: z.string() }).optional(),
        default: z.object({ url: z.string() }).optional(),
      })
      .optional(),
  }),
  contentDetails: z.object({
    videoId: z.string(),
  }),
});

const YoutubeApiResponseSchema = z.object({
  items: z.array(YoutubePlaylistItemSchema),
  nextPageToken: z.string().optional(),
});

const getPlaylistVideosFlow = ai.defineFlow(
  {
    name: 'getPlaylistVideosFlow',
    inputSchema: z.string(), // playlistId
    outputSchema: z.array(
      z.object({
        id: z.string(),
        videoId: z.string(),
        title: z.string(),
        description: z.string(),
        thumbnailUrl: z.string(),
        duration: z.string(),
      })
    ),
  },
  async (playlistId) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error('YOUTUBE_API_KEY environment variable is not set.');
    }

    let allVideos: Video[] = [];
    let nextPageToken: string | undefined = undefined;

    try {
      do {
        const params = new URLSearchParams({
          part: 'snippet,contentDetails',
          playlistId: playlistId,
          maxResults: '50',
          key: apiKey,
        });
        if (nextPageToken) {
          params.append('pageToken', nextPageToken);
        }

        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?${params.toString()}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`YouTube API error: ${errorData.error.message}`);
        }

        const data = await response.json();
        const parsedData = YoutubeApiResponseSchema.parse(data);

        const videos: Video[] = parsedData.items
            .filter(item => item.snippet.title !== 'Private video' && item.snippet.title !== 'Deleted video')
            .map((item, index) => ({
                id: `${playlistId}-${item.contentDetails.videoId}-${index}`,
                videoId: item.contentDetails.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnailUrl:
                    item.snippet.thumbnails?.high?.url ||
                    item.snippet.thumbnails?.medium?.url ||
                    item.snippet.thumbnails?.default?.url ||
                    '',
                duration: '0:00', // Duration is not available in playlistItems API, would need another API call per video.
        }));

        allVideos = [...allVideos, ...videos];
        nextPageToken = parsedData.nextPageToken;
      } while (nextPageToken);

      return allVideos;
    } catch (error) {
      console.error('Failed to fetch playlist videos:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch playlist. ${error.message}`);
      }
      throw new Error(
        'An unknown error occurred while fetching the playlist.'
      );
    }
  }
);

export async function getPlaylistVideos(playlistId: string): Promise<Video[]> {
  return getPlaylistVideosFlow(playlistId);
}
