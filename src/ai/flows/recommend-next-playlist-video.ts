'use server';
/**
 * @fileOverview A GenAI agent that recommends the next video to watch from a playlist.
 *
 * - recommendNextPlaylistVideo - A function that handles the video recommendation process.
 * - RecommendNextPlaylistVideoInput - The input type for the recommendNextPlaylistVideo function.
 * - RecommendNextPlaylistVideoOutput - The return type for the recommendNextPlaylistVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VideoSchema = z.object({
  videoId: z.string().describe('The unique identifier for the video.'),
  title: z.string().describe('The title of the video.'),
  description: z.string().describe('A brief description of the video content.'),
});

const RecommendNextPlaylistVideoInputSchema = z.object({
  watchedVideos: z
    .array(VideoSchema)
    .describe('A list of videos the user has already watched.'),
  unwatchedVideos: z
    .array(VideoSchema)
    .describe('A list of videos available in the playlist that the user has not yet watched.'),
});
export type RecommendNextPlaylistVideoInput = z.infer<
  typeof RecommendNextPlaylistVideoInputSchema
>;

const RecommendNextPlaylistVideoOutputSchema = z.object({
  recommendedVideoId: z
    .string()
    .describe('The videoId of the recommended unwatched video.'),
  reasoning: z
    .string()
    .describe(
      'A brief explanation of why this video was recommended based on the user\'s watched history.'
    ),
});
export type RecommendNextPlaylistVideoOutput = z.infer<
  typeof RecommendNextPlaylistVideoOutputSchema
>;

export async function recommendNextPlaylistVideo(
  input: RecommendNextPlaylistVideoInput
): Promise<RecommendNextPlaylistVideoOutput> {
  return recommendNextPlaylistVideoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendNextPlaylistVideoPrompt',
  input: {schema: RecommendNextPlaylistVideoInputSchema},
  output: {schema: RecommendNextPlaylistVideoOutputSchema},
  prompt: `You are an intelligent video recommendation engine for a platform called TrackTube.
Your task is to recommend the single most relevant unwatched video from a given playlist, based on the user's previously watched videos.

Here are the videos the user has already watched:
{{#each watchedVideos}}
Video ID: {{{videoId}}}
Title: {{{title}}}
Description: {{{description}}}
---
{{/each}}

Here are the unwatched videos available in the playlist:
{{#each unwatchedVideos}}
Video ID: {{{videoId}}}
Title: {{{title}}}
Description: {{{description}}}
---
{{/each}}

Analyze the watched videos to understand the user's preferences and then select ONE unwatched video that you believe is the best fit for them to watch next.
Provide the videoId of the recommended video and a concise reasoning for your choice.
`,
});

const recommendNextPlaylistVideoFlow = ai.defineFlow(
  {
    name: 'recommendNextPlaylistVideoFlow',
    inputSchema: RecommendNextPlaylistVideoInputSchema,
    outputSchema: RecommendNextPlaylistVideoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
