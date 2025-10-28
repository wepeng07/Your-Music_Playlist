export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  favoriteGenres: string[];
  favoriteArtists: string[];
  moodPreferences: string[];
  languagePreference: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  youtubeId: string;
  thumbnail: string;
  genre: string[];
  mood: string[];
  popularity: number;
  releaseDate?: Date;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags: string[];
}

export interface RecommendationRequest {
  prompt: string;
  userId: string;
  limit?: number;
  includeGenres?: string[];
  excludeGenres?: string[];
  mood?: string;
}

export interface RecommendationResponse {
  tracks: Track[];
  reasoning: string;
  prompt: string;
  timestamp: Date;
}

export interface SearchFilters {
  genre?: string[];
  mood?: string[];
  duration?: {
    min?: number;
    max?: number;
  };
  popularity?: {
    min?: number;
    max?: number;
  };
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}
