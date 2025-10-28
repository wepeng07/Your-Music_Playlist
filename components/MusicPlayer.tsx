'use client';

import React, { useState } from 'react';
import { Track } from '@/types';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Heart, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '@/contexts/PlayerContext';

interface MusicPlayerProps {
  className?: string;
}

export default function MusicPlayer({ className = '' }: MusicPlayerProps) {
  const {
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
    next,
    previous,
    setVolume,
    addToPlaylist,
  } = usePlayer();

  const [isLiked, setIsLiked] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: 实现喜欢功能
  };

  const handleAddToPlaylist = () => {
    if (currentTrack) {
      addToPlaylist(currentTrack);
    }
  };

  if (!currentTrack) {
    return (
      <div className={`bg-white dark:bg-dark-800 border-t border-dark-200 dark:border-dark-700 p-4 ${className}`}>
        <div className="flex items-center justify-center text-dark-500 dark:text-dark-400">
          <p>选择一首歌曲开始播放</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-dark-800 border-t border-dark-200 dark:border-dark-700 p-4 ${className}`}>
      <div className="flex items-center space-x-4">
        {/* 歌曲信息 */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="relative">
            <img
              src={currentTrack.thumbnail}
              alt={currentTrack.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-medium text-dark-900 dark:text-white truncate">
              {currentTrack.title}
            </h4>
            <p className="text-xs text-dark-500 dark:text-dark-400 truncate">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* 播放控制 */}
        <div className="flex items-center space-x-2">
          <button
            onClick={previous}
            disabled={currentIndex === 0}
            className="p-2 text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          
          <button
            onClick={handlePlayPause}
            className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors duration-200"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
          </button>
          
          <button
            onClick={next}
            disabled={currentIndex === playlist.length - 1}
            className="p-2 text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        {/* 进度条和时间 */}
        <div className="flex items-center space-x-2 flex-1 max-w-xs">
          <span className="text-xs text-dark-500 dark:text-dark-400 w-8">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 bg-dark-200 dark:bg-dark-600 rounded-full h-1">
            <div
              className="bg-primary-500 h-1 rounded-full transition-all duration-200"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs text-dark-500 dark:text-dark-400 w-8">
            {formatTime(duration)}
          </span>
        </div>

        {/* 音量控制 */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="p-2 text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200"
            >
              {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            {showVolumeSlider && (
              <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-dark-700 rounded-lg shadow-lg p-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-dark-200 dark:bg-dark-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* 其他操作 */}
        <div className="flex items-center space-x-1">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isLiked
                ? 'text-red-500 hover:text-red-600'
                : 'text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200'
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          
          <button className="p-2 text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

