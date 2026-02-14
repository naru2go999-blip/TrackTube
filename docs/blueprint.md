# **App Name**: TrackTube

## Core Features:

- Playlist Import: Import a YouTube playlist by URL, automatically fetching videos and storing them in Firestore.
- Progress Tracking: Track the user's progress through each video in the playlist, and automatically persist the completion status of each video using Firestore.
- Dashboard Visualization: Visualize overall progress with a pie chart showing completed vs. remaining videos, as well as aggregated statistics, using up-to-date data drawn from Firestore.
- Intelligent Recommendation: Recommend the next video to watch based on the videos already watched and other users' watching behavior; reasoning will be done using a tool. User history and recommendations are stored in Firestore.

## Style Guidelines:

- Primary color: Light indigo (#9370DB), chosen for its association with productivity and focus in a light theme.
- Background color: Very light indigo (#F0F8FF), creating a subtle, clean backdrop that complements the primary color.
- Accent color: Soft lavender (#E6E6FA) for interactive elements and highlights, providing a gentle contrast to the primary color.
- Body and headline font: 'Inter', a grotesque sans-serif known for its modern and readable appearance, making it suitable for both headers and body text.
- Note: currently only Google Fonts are supported.
- Emphasize a modern SaaS dashboard style with a clean, responsive grid layout.
- Incorporate rounded cards (12px radius) and soft shadows for visual depth.
- Use minimalistic icons from a consistent set (e.g., Material Design Icons) for a clean and modern look.
- Employ subtle animations, like fade-ins and transitions, to enhance the user experience.