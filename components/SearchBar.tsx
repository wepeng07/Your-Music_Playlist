'use client';

import React, { useState } from 'react';
import { Search, Sparkles, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onAIRecommend: (prompt: string) => void;
  loading?: boolean;
  className?: string;
}

export default function SearchBar({ 
  onSearch, 
  onAIRecommend, 
  loading = false, 
  className = '' 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isAIRecommendation, setIsAIRecommendation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (isAIRecommendation) {
      onAIRecommend(query);
    } else {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    setShowFilters(false);
  };

  const examplePrompts = [
    'Study music for concentration',
    'Relaxing jazz for work',
    'Upbeat workout playlist',
    'Nostalgic old songs',
    'Romantic love songs',
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isAIRecommendation ? "Describe the music you want..." : "Search for songs, artists, or albums..."}
              className="w-full pl-10 pr-4 py-3 border border-dark-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              disabled={loading}
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-dark-600 dark:hover:text-dark-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                {isAIRecommendation ? (
                  <Sparkles className="h-5 w-5" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
                <span>{isAIRecommendation ? 'AI Recommend' : 'Search'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Search Mode Toggle */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAIRecommendation(false)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
              !isAIRecommendation
                ? 'bg-primary-500 text-white'
                : 'bg-dark-200 dark:bg-dark-600 text-dark-700 dark:text-dark-300'
            }`}
          >
            Regular Search
          </button>
          <button
            onClick={() => setIsAIRecommendation(true)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
              isAIRecommendation
                ? 'bg-primary-500 text-white'
                : 'bg-dark-200 dark:bg-dark-600 text-dark-700 dark:text-dark-300'
            }`}
          >
            AI Recommend
          </button>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-1 text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200"
        >
          <Filter className="h-4 w-4" />
          <span className="text-sm">Filters</span>
        </button>
      </div>

      {/* AI Recommendation Examples */}
      {isAIRecommendation && (
        <div className="space-y-2">
          <p className="text-sm text-dark-600 dark:text-dark-400">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setQuery(prompt)}
                className="px-3 py-1 bg-dark-100 dark:bg-dark-700 text-dark-700 dark:text-dark-300 rounded-full text-sm hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors duration-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="bg-dark-50 dark:bg-dark-700 rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-dark-900 dark:text-white">Filter Conditions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-700 dark:text-dark-300 mb-2">
                Genre
              </label>
              <select className="w-full px-3 py-2 border border-dark-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-600 dark:text-white text-sm">
                <option value="">All Genres</option>
                <option value="pop">Pop</option>
                <option value="rock">Rock</option>
                <option value="jazz">Jazz</option>
                <option value="classical">Classical</option>
                <option value="electronic">Electronic</option>
                <option value="hip-hop">Hip-hop</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-dark-700 dark:text-dark-300 mb-2">
                Mood
              </label>
              <select className="w-full px-3 py-2 border border-dark-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-600 dark:text-white text-sm">
                <option value="">All Moods</option>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="relaxed">Relaxed</option>
                <option value="energetic">Energetic</option>
                <option value="romantic">Romantic</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-dark-700 dark:text-dark-300 mb-2">
                Duration
              </label>
              <select className="w-full px-3 py-2 border border-dark-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-600 dark:text-white text-sm">
                <option value="">Any Duration</option>
                <option value="short">Under 3 mins</option>
                <option value="medium">3-5 mins</option>
                <option value="long">Over 5 mins</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

