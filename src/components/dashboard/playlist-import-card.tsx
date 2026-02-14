'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'lucide-react';

type PlaylistImportCardProps = {
  onImport: (url: string) => void;
};

export function PlaylistImportCard({ onImport }: PlaylistImportCardProps) {
  const [url, setUrl] = useState('https://youtube.com/playlist?list=mock-playlist');

  const handleImport = () => {
    if (url) {
      onImport(url);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Playlist</CardTitle>
        <CardDescription>
          Paste a YouTube playlist URL to start tracking.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full items-center space-x-2">
          <div className="relative flex-1">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="url"
              placeholder="https://youtube.com/playlist?list=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-9"
            />
          </div>

          <Button type="submit" onClick={handleImport}>
            Import
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
