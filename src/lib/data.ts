import type { Video } from './types';
import { PlaceHolderImages } from './placeholder-images';

const videoThumbnails = PlaceHolderImages.reduce((acc, img) => {
  acc[img.id] = img.imageUrl;
  return acc;
}, {} as Record<string, string>);

export const mockPlaylist: Video[] = [
  {
    id: '1',
    videoId: 'vid001',
    title: 'Getting Started with React Hooks',
    description:
      'A comprehensive introduction to React Hooks, covering useState, useEffect, and custom hooks for state management and side effects in functional components.',
    thumbnailUrl: videoThumbnails['video-1-thumb'] || '',
    duration: '15:23',
  },
  {
    id: '2',
    videoId: 'vid002',
    title: 'Advanced State Management with Redux',
    description:
      'Explore advanced state management techniques using Redux Toolkit. Learn about slices, thunks, and best practices for large-scale applications.',
    thumbnailUrl: videoThumbnails['video-2-thumb'] || '',
    duration: '25:45',
  },
  {
    id: '3',
    videoId: 'vid003',
    title: 'UI/UX Design Principles for Developers',
    description:
      'Learn the fundamentals of UI/UX design from a developer\'s perspective. This guide covers layout, color theory, and creating intuitive user flows.',
    thumbnailUrl: videoThumbnails['video-3-thumb'] || '',
    duration: '18:10',
  },
  {
    id: '4',
    videoId: 'vid004',
    title: 'Building Server-Side Rendered Apps with Next.js',
    description:
      'A deep dive into Next.js, focusing on server-side rendering (SSR) and static site generation (SSG) to build high-performance web applications.',
    thumbnailUrl: videoThumbnails['video-4-thumb'] || '',
    duration: '32:50',
  },
  {
    id: '5',
    videoId: 'vid005',
    title: 'Mastering Component Design Systems',
    description:
      'An expert session on creating and maintaining a component design system. Learn how to build reusable, scalable, and consistent UI components.',
    thumbnailUrl: videoThumbnails['video-5-thumb'] || '',
    duration: '22:05',
  },
  {
    id: '6',
    videoId: 'vid006',
    title: 'Optimistic UI Updates in React',
    description:
      'Improve user experience by implementing optimistic UI updates. This tutorial shows how to update the UI before the server confirmation comes back.',
    thumbnailUrl: videoThumbnails['video-6-thumb'] || '',
    duration: '12:30',
  },
  {
    id: '7',
    videoId: 'vid007',
    title: 'Web Performance Optimization: The Critical Path',
    description:
      'Understand the critical rendering path and learn techniques to optimize your website\'s loading performance for a faster user experience.',
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
