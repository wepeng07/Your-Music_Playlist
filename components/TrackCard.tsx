'use client';

import React, { useState, useEffect } from 'react';
import { Track } from '@/types';
import { Play, Pause, Heart, MoreHorizontal, Clock, Music, ExternalLink } from 'lucide-react';
import { usePlayer } from '@/contexts/PlayerContext';
import toast from 'react-hot-toast';

interface TrackCardProps {
  track: Track;
  showIndex?: boolean;
  index?: number;
  className?: string;
}

export default function TrackCard({ 
  track, 
  showIndex = false, 
  index = 0, 
  className = '' 
}: TrackCardProps) {
  const { currentTrack, isPlaying, play, pause, addToPlaylist } = usePlayer();
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isCurrentTrack = currentTrack?.id === track.id;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isCurrentTrack) {
      if (isPlaying) {
        pause();
      } else {
        play(track);
      }
    } else {
      play(track);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? '已取消喜欢' : '已添加到喜欢');
  };

  const handleAddToPlaylist = () => {
    addToPlaylist(track);
    toast.success('已添加到播放列表');
  };

  const handleOpenYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${track.youtubeId}`, '_blank');
  };

  return (
    <div
      className={`group flex items-center space-x-4 p-3 rounded-lg hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors duration-200 ${className} ${
        isCurrentTrack ? 'bg-primary-50 dark:bg-primary-900/20' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 索引或播放按钮 */}
      <div className="w-6 flex items-center justify-center">
        {showIndex ? (
          <span className="text-sm text-dark-500 dark:text-dark-400">
            {index + 1}
          </span>
        ) : (
          <button
            onClick={handlePlayPause}
            className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
              isCurrentlyPlaying ? 'opacity-100' : ''
            }`}
          >
            {isCurrentlyPlaying ? (
              <Pause className="h-4 w-4 text-primary-500" />
            ) : (
              <Play className="h-4 w-4 text-dark-500 dark:text-dark-400" />
            )}
          </button>
        )}
      </div>

      {/* 缩略图 */}
      <div className="relative">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="w-12 h-12 rounded-lg object-cover"
        />
        {isCurrentlyPlaying && (
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      {/* 歌曲信息 */}
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-medium truncate ${
          isCurrentTrack 
            ? 'text-primary-600 dark:text-primary-400' 
            : 'text-dark-900 dark:text-white'
        }`}>
          {track.title}
        </h4>
        <p className="text-xs text-dark-500 dark:text-dark-400 truncate">
          {track.artist}
        </p>
        {track.genre && track.genre.length > 0 && (
          <div className="flex items-center space-x-1 mt-1">
            <Music className="h-3 w-3 text-dark-400" />
            <span className="text-xs text-dark-400 dark:text-dark-500">
              {track.genre.slice(0, 2).join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* 时长 */}
      <div className="flex items-center space-x-1 text-xs text-dark-500 dark:text-dark-400">
        <Clock className="h-3 w-3" />
        <span>{formatDuration(track.duration)}</span>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleLike}
          className={`p-2 rounded-full transition-colors duration-200 ${
            isLiked
              ? 'text-red-500 hover:text-red-600'
              : 'text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200'
          }`}
          title="喜欢"
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
        
        <button
          onClick={handleOpenYouTube}
          className="p-2 text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200 rounded-full transition-colors duration-200"
          title="在YouTube中打开"
        >
          <ExternalLink className="h-4 w-4" />
        </button>
        
        <button
          onClick={handleAddToPlaylist}
          className="p-2 text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200 rounded-full transition-colors duration-200"
          title="添加到播放列表"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

