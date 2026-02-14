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

export function PlaylistImportCard() {
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
              defaultValue="https://youtube.com/playlist?list=mock-playlist"
              disabled
              className="pl-9"
            />
          </div>

          <Button type="submit" disabled>
            Import
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Playlist import is disabled for this demo. A mock playlist has been
          loaded for you.
        </p>
      </CardContent>
    </Card>
  );
}
