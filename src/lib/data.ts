import type { Playlist } from './types';
import { PlaceHolderImages } from './placeholder-images';

const videoThumbnails = PlaceHolderImages.reduce((acc, img) => {
  acc[img.id] = img.imageUrl;
  return acc;
}, {} as Record<string, string>);

export const allMockVideos = [
  {
    id: '1',
    videoId: 'vid001',
    title: 'Lecture 1 - Introduction',
    description:
      'A comprehensive introduction to Control Systems, covering basic concepts and terminology.',
    thumbnailUrl: videoThumbnails['video-1-thumb'] || '',
    duration: '15:23',
  },
  {
    id: '2',
    videoId: 'vid002',
    title: 'Lecture 2 - Transfer Function',
    description:
      'Explore transfer functions and their importance in modeling dynamic systems.',
    thumbnailUrl: videoThumbnails['video-2-thumb'] || '',
    duration: '25:45',
  },
  {
    id: '3',
    videoId: 'vid003',
    title: 'Lecture 3 - Block Diagram',
    description:
      'Learn how to use block diagrams to represent and analyze complex control systems.',
    thumbnailUrl: videoThumbnails['video-3-thumb'] || '',
    duration: '18:10',
  },
  {
    id: '4',
    videoId: 'vid004',
    title: 'Lecture 1 - Introduction to ML',
    description:
      'A deep dive into Machine Learning, focusing on core principles and applications.',
    thumbnailUrl: videoThumbnails['video-4-thumb'] || '',
    duration: '32:50',
  },
  {
    id: '5',
    videoId: 'vid005',
    title: 'Lecture 2 - Linear Regression',
    description:
      'An expert session on Linear Regression, a foundational algorithm in machine learning.',
    thumbnailUrl: videoThumbnails['video-5-thumb'] || '',
    duration: '22:05',
  },
  {
    id: '6',
    videoId: 'vid006',
    title: 'Lecture 3 - Logistic Regression',
    description:
      'Improve your understanding of classification problems by mastering Logistic Regression.',
    thumbnailUrl: videoThumbnails['video-6-thumb'] || '',
    duration: '12:30',
  },
  {
    id: '7',
    videoId: 'vid007',
    title: 'Web Performance Optimization: The Critical Path',
    description:
      "Understand the critical rendering path and learn techniques to optimize your website's loading performance for a faster user experience.",
    thumbnailUrl: videoThumbnails['video-7-thumb'] || '',
    duration: '28:00',
  },
  {
    id: '8',
    videoId: 'vid008',
    title: 'Styling with Tailwind CSS: A Practical Guide',
    description:
      'A hands-on guide to using Tailwind CSS. Learn how to rapidly build modern designs without leaving your HTML, and how to customize your own utility classes.',
    thumbnailUrl: videoThumbnails['video-8-thumb'] || '',
    duration: '20:15',
  },
];


export const mockPlaylists: Playlist[] = [
  {
    id: 'pl1',
    name: 'Control Systems Engineering',
    videos: allMockVideos.slice(0, 3),
  },
  {
    id: 'pl2',
    name: 'Machine Learning Fundamentals',
    videos: allMockVideos.slice(3, 6),
  },
];
