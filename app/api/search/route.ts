import { NextRequest, NextResponse } from 'next/server';
import { searchMusicTracks } from '@/lib/youtube';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Invalid search query' },
        { status: 400 }
      );
    }

    const tracks = await searchMusicTracks(query, 20);
    
    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
