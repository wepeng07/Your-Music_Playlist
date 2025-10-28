import { searchMusicTracks, getTrackDetails, getRelatedTracks } from '@/lib/youtube';

// Mock googleapis
jest.mock('googleapis', () => ({
  google: {
    youtube: jest.fn(() => ({
      search: {
        list: jest.fn(),
      },
      videos: {
        list: jest.fn(),
      },
    })),
  },
}));

describe('YouTube API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchMusicTracks', () => {
    it('should search for music tracks successfully', async () => {
      const mockResponse = {
        data: {
          items: [
            {
              id: { videoId: 'test123' },
              snippet: {
                title: 'Test Song - Test Artist',
                thumbnails: {
                  high: { url: 'https://example.com/thumb.jpg' },
                },
              },
            },
          ],
        },
      };

      const mockYoutube = {
        search: {
          list: jest.fn().mockResolvedValue(mockResponse),
        },
      };

      require('googleapis').google.youtube.mockReturnValue(mockYoutube);

      const tracks = await searchMusicTracks('test query', 10);

      expect(tracks).toHaveLength(1);
      expect(tracks[0]).toEqual({
        id: 'test123',
        title: 'Test Song - Test Artist',
        artist: 'Test Song',
        duration: 0,
        youtubeId: 'test123',
        thumbnail: 'https://example.com/thumb.jpg',
        genre: [],
        mood: [],
        popularity: expect.any(Number),
      });
    });

    it('should handle empty search results', async () => {
      const mockResponse = {
        data: {
          items: [],
        },
      };

      const mockYoutube = {
        search: {
          list: jest.fn().mockResolvedValue(mockResponse),
        },
      };

      require('googleapis').google.youtube.mockReturnValue(mockYoutube);

      const tracks = await searchMusicTracks('nonexistent', 10);

      expect(tracks).toHaveLength(0);
    });

    it('should handle API errors', async () => {
      const mockYoutube = {
        search: {
          list: jest.fn().mockRejectedValue(new Error('API Error')),
        },
      };

      require('googleapis').google.youtube.mockReturnValue(mockYoutube);

      await expect(searchMusicTracks('test', 10)).rejects.toThrow('Failed to search music tracks');
    });
  });

  describe('getTrackDetails', () => {
    it('should get track details successfully', async () => {
      const mockResponse = {
        data: {
          items: [
            {
              contentDetails: {
                duration: 'PT3M30S',
              },
              statistics: {
                viewCount: '1000000',
              },
            },
          ],
        },
      };

      const mockYoutube = {
        videos: {
          list: jest.fn().mockResolvedValue(mockResponse),
        },
      };

      require('googleapis').google.youtube.mockReturnValue(mockYoutube);

      const details = await getTrackDetails('test123');

      expect(details).toEqual({
        duration: 210, // 3 minutes 30 seconds
        popularity: 1000000,
      });
    });

    it('should handle video not found', async () => {
      const mockResponse = {
        data: {
          items: [],
        },
      };

      const mockYoutube = {
        videos: {
          list: jest.fn().mockResolvedValue(mockResponse),
        },
      };

      require('googleapis').google.youtube.mockReturnValue(mockYoutube);

      await expect(getTrackDetails('nonexistent')).rejects.toThrow('Video not found');
    });
  });

  describe('getRelatedTracks', () => {
    it('should get related tracks successfully', async () => {
      const mockResponse = {
        data: {
          items: [
            {
              id: { videoId: 'related123' },
              snippet: {
                title: 'Related Song - Related Artist',
                thumbnails: {
                  high: { url: 'https://example.com/related.jpg' },
                },
              },
            },
          ],
        },
      };

      const mockYoutube = {
        search: {
          list: jest.fn().mockResolvedValue(mockResponse),
        },
      };

      require('googleapis').google.youtube.mockReturnValue(mockYoutube);

      const tracks = await getRelatedTracks('test123', 5);

      expect(tracks).toHaveLength(1);
      expect(tracks[0].id).toBe('related123');
    });
  });
});

