'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type PlaylistImportCardProps = {
  onImport: (url: string, name: string) => void;
};

export function PlaylistImportCard({ onImport }: PlaylistImportCardProps) {
  const [url, setUrl] = useState('https://www.youtube.com/playlist?list=...');
  const [name, setName] = useState('');

  const handleImport = () => {
    if (url && name) {
      onImport(url, name);
      setUrl('https://www.youtube.com/playlist?list=...');
      setName('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Playlist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-1 space-y-2">
            <Label htmlFor="playlist-name">Playlist Name</Label>
            <Input
              id="playlist-name"
              type="text"
              placeholder="e.g. JavaScript Mastery"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="md:col-span-1 space-y-2">
            <Label htmlFor="playlist-url">YouTube Playlist Link</Label>
            <Input
              id="playlist-url"
              type="url"
              placeholder="https://youtube.com/playlist?list=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button type="button" onClick={handleImport} className="w-full md:w-auto">
            Add Playlist
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
