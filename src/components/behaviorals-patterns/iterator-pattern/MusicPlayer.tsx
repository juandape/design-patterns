'use client';

import { PlaylistIterator } from './PlaylistIterator';
import { useMemo, useState } from 'react';
import { Song } from './types/song.type';

const songs: Song[] = [
  { id: 1, title: 'Song 1', artist: 'Artist 1' },
  { id: 2, title: 'Song 2', artist: 'Artist 2' },
  { id: 3, title: 'Song 3', artist: 'Artist 3' },
];

export const MusicPlayer = () => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  const iterator = useMemo(() => new PlaylistIterator(songs), []);

  const handleNext = () => {
    const nextSong = iterator.next();
    if (nextSong) {
      setCurrentSong(nextSong);
    }
  };

  const handlePrevious = () => {
    const previousSong = iterator.previous();
    if (previousSong) {
      setCurrentSong(previousSong);
    }
  };

  const handleReset = () => {
    iterator.reset();
    setCurrentSong(null);
  };

  return (
    <div className='ml-5 mt-5 border p-4 w-96'>
      <h2>Music Player - iterator pattern</h2>
      <div className='flex gap-2 mb-4'>
        <button
          onClick={handleNext}
          disabled={!iterator.hasNext()}
          className='bg-red-500 cursor-pointer rounded-2xl p-2 disabled:cursor-not-allowed disabled:bg-gray-400'
        >
          Next
        </button>
        <button
          onClick={handlePrevious}
          disabled={!iterator.hasPrevious()}
          className='bg-amber-500 cursor-pointer rounded-2xl p-2 disabled:cursor-not-allowed disabled:bg-gray-400 '
        >
          Previous
        </button>
        <button
          onClick={handleReset}
          className='bg-yellow-500 cursor-pointer rounded-2xl p-2'
        >
          Reset
        </button>
      </div>
      <div>
        {currentSong ? (
          <div>
            <h3>{currentSong.title}</h3>
            <p>{currentSong.artist}</p>
          </div>
        ) : (
          <p>No song selected</p>
        )}
      </div>
    </div>
  );
};
