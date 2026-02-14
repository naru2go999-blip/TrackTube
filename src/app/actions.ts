'use server';

import {
  recommendNextPlaylistVideo,
  RecommendNextPlaylistVideoInput,
} from '@/ai/flows/recommend-next-playlist-video';

export async function getRecommendationAction(
  input: RecommendNextPlaylistVideoInput
) {
  try {
    const result = await recommendNextPlaylistVideo(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting recommendation:', error);
    if (error instanceof Error) {
        return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred.' };
  }
}
