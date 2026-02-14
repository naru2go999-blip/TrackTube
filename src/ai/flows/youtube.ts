'use server';
/**
 * @fileOverview A flow for interacting with the YouTube API.
 *
 * - getPlaylistVideos - Fetches all videos and the title from a given YouTube playlist ID.
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

// This is a subset of the YouTube API playlist details.
// See: https://developers.google.com/youtube/v3/docs/playlists#resource
const YoutubePlaylistDetailsItemSchema = z.object({
  snippet: z.object({
    title: z.string(),
  }),
});

const YoutubePlaylistDetailsResponseSchema = z.object({
  items: z.array(YoutubePlaylistDetailsItemSchema),
});


const PlaylistOutputSchema = z.object({
    playlistTitle: z.string(),
    videos: z.array(
      z.object({
        id: z.string(),
        videoId: z.string(),
        title: z.string(),
        description: z.string(),
        thumbnailUrl: z.string(),
        duration: z.string(),
      })
    ),
  });

const getPlaylistVideosFlow = ai.defineFlow(
  {
    name: 'getPlaylistVideosFlow',
    inputSchema: z.string(), // playlistId
    outputSchema: PlaylistOutputSchema,
  },
  async (playlistId) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error('YOUTUBE_API_KEY environment variable is not set.');
    }

    try {
      // 1. Fetch Playlist Title
      const playlistDetailsParams = new URLSearchParams({
        part: 'snippet',
        id: playlistId,
        key: apiKey,
      });
      const playlistDetailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?${playlistDetailsParams.toString()}`
      );

      if (!playlistDetailsResponse.ok) {
        const errorData = await playlistDetailsResponse.json();
        throw new Error(`YouTube API error (playlists): ${errorData.error.message}`);
      }

      const playlistDetailsData = await playlistDetailsResponse.json();
      const parsedPlaylistDetails =
        YoutubePlaylistDetailsResponseSchema.parse(playlistDetailsData);

      const playlistTitle = parsedPlaylistDetails.items[0]?.snippet.title;

      if (!playlistTitle) {
        throw new Error(
          'Could not retrieve playlist title. The playlist might be private or deleted.'
        );
      }
      
      // 2. Fetch Videos
      let allVideos: Video[] = [];
      let nextPageToken: string | undefined = undefined;

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

      return { playlistTitle, videos: allVideos };
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

export async function getPlaylistVideos(playlistId: string): Promise<{ playlistTitle: string, videos: Video[] }> {
  return getPlaylistVideosFlow(playlistId);
}
