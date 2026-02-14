export interface Video {
  id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
}

export interface Playlist {
  id: string;
  name: string;
  videos: Video[];
}
