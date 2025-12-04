import { Iterator } from './types/iterator.type';
import {Song} from './types/song.type'

export class PlaylistIterator implements Iterator<Song> {
  private currentIndex: number = 0;
  private readonly songs: Song[];

  constructor(songs: Song[]) {
    this.songs = songs;
  }

  hasNext(): boolean {
    return this.currentIndex < this.songs.length;
  }

  hasPrevious(): boolean {
    return this.currentIndex > 0;
  }

  next(): Song | null {
    if (this.hasNext()) {
      return this.songs[this.currentIndex++];
    }
    return null;
  }

  current(): Song | null {
    if (this.currentIndex === 0) {
      return null;
    }
    return this.songs[this.currentIndex - 1];
  }

  previous(): Song | null {
    if (this.currentIndex === 0) {
      return null;
    }
    return this.songs[--this.currentIndex];
  }

  reset(): void {
    this.currentIndex = 0;
  }
}
