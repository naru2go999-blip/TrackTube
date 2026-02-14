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
import { Label } from '@/components/ui/label';

type PlaylistImportCardProps = {
  onImport: (url: string, name: string) => void;
};

export function PlaylistImportCard({ onImport }: PlaylistImportCardProps) {
  const [url, setUrl] = useState('https://www.youtube.com/playlist?list=mock-playlist');
  const [name, setName] = useState('My Awesome Playlist');

  const handleImport = () => {
    if (url && name) {
      onImport(url, name);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Playlist</CardTitle>
        <CardDescription>
          Paste a YouTube playlist URL and give it a name to start tracking.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playlist-name">Playlist Name</Label>
            <Input
              id="playlist-name"
              type="text"
              placeholder="e.g. Frontend Masters"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="playlist-url">Playlist URL</Label>
            <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                id="playlist-url"
                type="url"
                placeholder="https://youtube.com/playlist?list=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-9"
                />
            </div>
          </div>
          <Button type="submit" onClick={handleImport} className="w-full">
            Import
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
