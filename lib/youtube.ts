import { google } from 'googleapis';
import { Track } from '@/types';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export async function searchMusicTracks(query: string, maxResults: number = 10): Promise<Track[]> {
  try {
    const response = await youtube.search.list({
      part: ['snippet'],
      q: query,
      type: ['video'],
      maxResults,
      videoCategoryId: '10', // Music category
      order: 'relevance',
    });

    const tracks: Track[] = [];

    for (const item of response.data.items || []) {
      if (item.id?.videoId && item.snippet) {
        const track: Track = {
          id: item.id.videoId,
          title: item.snippet.title || '',
          artist: extractArtistFromTitle(item.snippet.title || ''),
          duration: 0, // 需要额外的API调用来获取时长
          youtubeId: item.id.videoId,
          thumbnail: item.snippet.thumbnails?.high?.url || '',
          genre: [], // 需要额外的API调用来获取类型信息
          mood: [], // 需要额外的API调用来获取情绪信息
          popularity: Math.floor(Math.random() * 100), // 模拟数据
        };
        
        tracks.push(track);
      }
    }

    return tracks;
  } catch (error) {
    console.error('YouTube API error:', error);
    throw new Error('Failed to search music tracks');
  }
}

export async function getTrackDetails(videoId: string): Promise<Partial<Track>> {
  try {
    const response = await youtube.videos.list({
      part: ['contentDetails', 'statistics'],
      id: [videoId],
    });

    const video = response.data.items?.[0];
    if (!video) {
      throw new Error('Video not found');
    }

    return {
      duration: parseDuration(video.contentDetails?.duration || 'PT0S'),
      popularity: parseInt(video.statistics?.viewCount || '0'),
    };
  } catch (error) {
    console.error('YouTube API error:', error);
    throw new Error('Failed to get track details');
  }
}

export async function getRelatedTracks(videoId: string, maxResults: number = 5): Promise<Track[]> {
  try {
    const response = await youtube.search.list({
      part: ['snippet'],
      relatedToVideoId: videoId,
      type: ['video'],
      maxResults,
      videoCategoryId: '10', // Music category
    });

    const tracks: Track[] = [];

    for (const item of response.data.items || []) {
      if (item.id?.videoId && item.snippet) {
        const track: Track = {
          id: item.id.videoId,
          title: item.snippet.title || '',
          artist: extractArtistFromTitle(item.snippet.title || ''),
          duration: 0,
          youtubeId: item.id.videoId,
          thumbnail: item.snippet.thumbnails?.high?.url || '',
          genre: [],
          mood: [],
          popularity: Math.floor(Math.random() * 100),
        };
        
        tracks.push(track);
      }
    }

    return tracks;
  } catch (error) {
    console.error('YouTube API error:', error);
    throw new Error('Failed to get related tracks');
  }
}

function extractArtistFromTitle(title: string): string {
  // 尝试从标题中提取艺术家名称
  // 常见的格式: "Artist - Song Title" 或 "Song Title - Artist"
  const patterns = [
    /^(.+?)\s*[-–]\s*(.+)$/, // "Artist - Song"
    /^(.+?)\s*:\s*(.+)$/, // "Artist: Song"
    /^(.+?)\s*–\s*(.+)$/, // "Artist – Song"
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      // 返回较短的作为艺术家名称
      return match[1].length < match[2].length ? match[1].trim() : match[2].trim();
    }
  }

  // 如果没有匹配到模式，返回标题的前半部分
  return title.split(' ').slice(0, 3).join(' ');
}

function parseDuration(duration: string): number {
  // 解析ISO 8601持续时间格式 (PT4M13S)
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');

  return hours * 3600 + minutes * 60 + seconds;
}

