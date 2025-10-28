'use client';

import React, { createContext, useContext, useState } from 'react';
import { Track } from '@/types';

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playlist: Track[];
  currentIndex: number;
  play: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setPlaylist: (tracks: Track[]) => void;
  addToPlaylist: (track: Track) => void;
  removeFromPlaylist: (index: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [currentTime, setCurrentTimeState] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylistState] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const play = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    // 如果播放列表中没有当前歌曲，添加到播放列表
    if (!playlist.find(t => t.id === track.id)) {
      setPlaylistState(prev => [...prev, track]);
      setCurrentIndex(playlist.length);
    } else {
      setCurrentIndex(playlist.findIndex(t => t.id === track.id));
    }
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const resume = () => {
    setIsPlaying(true);
  };

  const stop = () => {
    setIsPlaying(false);
    setCurrentTimeState(0);
  };

  const next = () => {
    if (currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentTrack(playlist[nextIndex]);
    }
  };

  const previous = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentTrack(playlist[prevIndex]);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  };

  const setCurrentTime = (time: number) => {
    setCurrentTimeState(Math.max(0, Math.min(duration, time)));
  };

  const setPlaylist = (tracks: Track[]) => {
    setPlaylistState(tracks);
    setCurrentIndex(0);
    if (tracks.length > 0) {
      setCurrentTrack(tracks[0]);
    }
  };

  const addToPlaylist = (track: Track) => {
    setPlaylistState(prev => [...prev, track]);
  };

  const removeFromPlaylist = (index: number) => {
    setPlaylistState(prev => prev.filter((_, i) => i !== index));
    if (index === currentIndex && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const value: PlayerContextType = {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    playlist,
    currentIndex,
    play,
    pause,
    resume,
    stop,
    next,
    previous,
    setVolume,
    setCurrentTime,
    setPlaylist,
    addToPlaylist,
    removeFromPlaylist,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}