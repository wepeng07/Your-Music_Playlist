'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { Track, RecommendationRequest } from '@/types';
import { Music, User, LogOut, Settings, Heart, ListMusic } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import SearchBar from '@/components/SearchBar';
import TrackCard from '@/components/TrackCard';
import MusicPlayer from '@/components/MusicPlayer';
import toast from 'react-hot-toast';

export default function HomePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { playlist } = usePlayer();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'playlist' | 'favorites'>('search');

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setTracks(data.tracks);
    } catch (error) {
      toast.error('Search failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleAIRecommend = async (prompt: string) => {
    if (!user) {
      toast.error('Please login first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          prompt,
          userId: user.id,
          limit: 10,
        } as RecommendationRequest),
      });

      if (!response.ok) {
        throw new Error('Recommendation failed');
      }

      const data = await response.json();
      setTracks(data.tracks);
      
      if (data.reasoning) {
        toast.success(`AI Recommendation: ${data.reasoning}`);
      }
    } catch (error) {
      toast.error('AI recommendation failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Header Navigation */}
      <header className="bg-white dark:bg-dark-800 shadow-sm border-b border-dark-200 dark:border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Music className="h-8 w-8 text-primary-500" />
                <span className="text-xl font-bold text-dark-900 dark:text-white">
                  YourMusic
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-dark-900 dark:text-white">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openAuthModal('signin')}
                    className="px-4 py-2 text-dark-700 dark:text-dark-300 hover:text-primary-500 font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Area */}
        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            onAIRecommend={handleAIRecommend}
            loading={loading}
          />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-dark-200 dark:border-dark-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('search')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'search'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-300'
                }`}
              >
                Search Results
              </button>
              <button
                onClick={() => setActiveTab('playlist')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'playlist'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-300'
                }`}
              >
                Playlist ({playlist.length})
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'favorites'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-300'
                }`}
              >
                My Favorites
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm">
          {activeTab === 'search' && (
            <div className="p-6">
              {tracks.length > 0 ? (
                <div className="space-y-2">
                  {tracks.map((track, index) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      showIndex={true}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Music className="h-12 w-12 text-dark-400 mx-auto mb-4" />
                  <p className="text-dark-500 dark:text-dark-400">
                    Search for music or use AI recommendation to discover new songs
                  </p>
                </div>
              )}
            </div>
          )}

              {activeTab === 'playlist' && (
                <div className="p-6">
                  {playlist.length > 0 ? (
                    <div className="space-y-2">
                      {playlist.map((track, index) => (
                        <TrackCard
                          key={track.id}
                          track={track}
                          showIndex={true}
                          index={index}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ListMusic className="h-12 w-12 text-dark-400 mx-auto mb-4" />
                      <p className="text-dark-500 dark:text-dark-400">
                        Playlist is empty, add some songs to start playing
                      </p>
                    </div>
                  )}
                </div>
              )}

          {activeTab === 'favorites' && (
            <div className="p-6">
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-dark-400 mx-auto mb-4" />
                <p className="text-dark-500 dark:text-dark-400">
                  No favorite songs yet
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Music Player */}
      <MusicPlayer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </div>
  );
}
