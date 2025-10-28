import { generateMusicRecommendations } from '@/lib/openai';

// Mock OpenAI
jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    })),
  };
});

describe('OpenAI API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateMusicRecommendations', () => {
    it('should generate music recommendations successfully', async () => {
      const mockCompletion = {
        choices: [
          {
            message: {
              content: '推荐理由：这些歌曲适合学习时听\n\n1. 轻音乐 - 钢琴曲\n2. 古典音乐 - 巴赫\n3. 环境音乐 - 自然声音',
            },
          },
        ],
      };

      const mockOpenAI = {
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue(mockCompletion),
          },
        },
      };

      require('openai').default.mockImplementation(() => mockOpenAI);

      const request = {
        prompt: '适合学习的轻音乐',
        userId: 'test-user',
        limit: 5,
      };

      const result = await generateMusicRecommendations(request);

      expect(result).toHaveProperty('tracks');
      expect(result).toHaveProperty('reasoning');
      expect(result.tracks).toBeInstanceOf(Array);
      expect(result.reasoning).toContain('推荐理由');
    });

    it('should handle OpenAI API errors', async () => {
      const mockOpenAI = {
        chat: {
          completions: {
            create: jest.fn().mockRejectedValue(new Error('OpenAI API Error')),
          },
        },
      };

      require('openai').default.mockImplementation(() => mockOpenAI);

      const request = {
        prompt: 'test prompt',
        userId: 'test-user',
        limit: 5,
      };

      await expect(generateMusicRecommendations(request)).rejects.toThrow(
        'Failed to generate music recommendations'
      );
    });

    it('should handle empty response', async () => {
      const mockCompletion = {
        choices: [
          {
            message: {
              content: '',
            },
          },
        ],
      };

      const mockOpenAI = {
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue(mockCompletion),
          },
        },
      };

      require('openai').default.mockImplementation(() => mockOpenAI);

      const request = {
        prompt: 'test prompt',
        userId: 'test-user',
        limit: 5,
      };

      const result = await generateMusicRecommendations(request);

      expect(result.tracks).toHaveLength(0);
      expect(result.reasoning).toBe('');
    });
  });
});

