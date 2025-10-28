import { NextRequest, NextResponse } from 'next/server';
import { generateMusicRecommendations } from '@/lib/openai';
import { searchMusicTracks } from '@/lib/youtube';
import { RecommendationRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json();
    const { prompt, userId, limit = 10, includeGenres, excludeGenres, mood } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid recommendation prompt' },
        { status: 400 }
      );
    }

    // Generate AI keywords
    const aiRecommendation = await generateMusicRecommendations({
      prompt,
      userId: userId || 'demo-user',
      limit,
      includeGenres,
      excludeGenres,
      mood,
    });

    // Search YouTube using AI-generated keywords
    const allTracks: any[] = [];
    
    // Search for each keyword and merge results
    for (const keyword of aiRecommendation.keywords) {
      try {
        const youtubeTracks = await searchMusicTracks(keyword, Math.ceil(limit / aiRecommendation.keywords.length));
        allTracks.push(...youtubeTracks);
      } catch (error) {
        console.error(`Failed to search for keyword "${keyword}":`, error);
      }
    }

    // Remove duplicates and limit results
    const uniqueTracks = Array.from(
      new Map(allTracks.map(track => [track.id, track])).values()
    ).slice(0, limit);

    return NextResponse.json({
      tracks: uniqueTracks,
      reasoning: aiRecommendation.reasoning,
      keywords: aiRecommendation.keywords,
      tags: aiRecommendation.tags,
      searchType: aiRecommendation.searchType,
      prompt,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Recommendation API error:', error);
    return NextResponse.json(
      { error: 'Recommendation failed' },
      { status: 500 }
    );
  }
}