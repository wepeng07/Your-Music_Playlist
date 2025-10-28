'use client';

import React, { createContext, useContext, useState } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  preferences: {
    favoriteGenres: string[];
    favoriteArtists: string[];
    moodPreferences: string[];
    languagePreference: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // 模拟登录 - 暂时不使用Firebase
      const mockUser: User = {
        id: 'mock-user-id',
        email,
        name: email.split('@')[0],
        createdAt: new Date(),
        preferences: {
          favoriteGenres: [],
          favoriteArtists: [],
          moodPreferences: [],
          languagePreference: 'zh-CN',
        },
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // 模拟注册 - 暂时不使用Firebase
      const mockUser: User = {
        id: 'mock-user-id-' + Date.now(),
        email,
        name,
        createdAt: new Date(),
        preferences: {
          favoriteGenres: [],
          favoriteArtists: [],
          moodPreferences: [],
          languagePreference: 'zh-CN',
        },
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // 检查本地存储的用户数据
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}