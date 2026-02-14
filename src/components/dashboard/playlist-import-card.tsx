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
import { Loader2 } from 'lucide-react';

type PlaylistImportCardProps = {
  onImport: (url: string, name: string) => void;
  isLoading: boolean;
};

export function PlaylistImportCard({ onImport, isLoading }: PlaylistImportCardProps) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');

  const handleImport = () => {
    if (url && name && !isLoading) {
      onImport(url, name);
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <Button type="button" onClick={handleImport} className="w-full md:w-auto" disabled={isLoading || !url || !name}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : 'Add Playlist'
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
