import OpenAI from 'openai';
import { Track, RecommendationRequest } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.deepseek.com', // Use DeepSeek API endpoint
});

export async function generateMusicRecommendations(request: RecommendationRequest): Promise<{
  keywords: string[];
  reasoning: string;
  tags: string[];
  searchType: string;
}> {
  try {
    const systemPrompt = `You are a professional music recommendation expert. Based on the user's description, generate search keywords and tags.

Your tasks:
1. Analyze user intent and requirements
2. Generate the most appropriate search keywords and tags
3. Do not recommend specific songs, but generate descriptive keywords for searching

Return format (JSON only):
{
  "reasoning": "Reasoning for recommendations",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "tags": ["tag1", "tag2"],
  "searchType": "artist|song|genre|mood"
}

Return pure JSON format only.`;

    const userPrompt = `User Request: ${request.prompt}
User Preferences: ${request.includeGenres?.join(', ') || 'no specific preference'}
Exclude Genres: ${request.excludeGenres?.join(', ') || 'none'}
Mood Preference: ${request.mood || 'no specific mood'}
Recommendation Count: ${request.limit || 10} songs`;

    // Log request parameters
    console.log('====================');
    console.log('Request to DeepSeek:');
    console.log('User request:', request.prompt);
    console.log('User preferences:', request.includeGenres?.join(', ') || 'no specific preference');
    console.log('====================');

    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat', // Use DeepSeek model
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // Log DeepSeek API response
    console.log('====================');
    console.log('DeepSeek API Response:');
    console.log('====================');
    console.log(response);
    console.log('====================');
    
    // Parse JSON response
    let result;
    try {
      result = JSON.parse(response);
    } catch (error) {
      // If parsing fails, try to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response JSON');
      }
    }
    
    return {
      keywords: result.keywords || [],
      reasoning: result.reasoning || 'Recommending music based on your description',
      tags: result.tags || [],
      searchType: result.searchType || 'song',
    };
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    
    // If insufficient balance, return friendly error message
    if (error.status === 402) {
      throw new Error('Insufficient DeepSeek API balance. Please top up to use this feature.');
    }
    
    throw new Error('Failed to generate music recommendations');
  }
}


