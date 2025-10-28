'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Music, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuthModal({ isOpen, onClose, mode = 'signin' }: {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'signin' | 'signup';
}) {
  const [isSignUp, setIsSignUp] = useState(mode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, name);
        toast.success('注册成功！');
      } else {
        await signIn(email, password);
        toast.success('登录成功！');
      }
      onClose();
      setEmail('');
      setPassword('');
      setName('');
    } catch (error: any) {
      toast.error(error.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 w-full max-w-md mx-4">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2">
            <Music className="h-8 w-8 text-primary-500" />
            <span className="text-2xl font-bold text-dark-900 dark:text-white">
              YourMusic
            </span>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
            {isSignUp ? '创建账户' : '欢迎回来'}
          </h2>
          <p className="text-dark-600 dark:text-dark-400">
            {isSignUp ? '开始你的音乐之旅' : '登录以继续'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                姓名
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-dark-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                placeholder="请输入您的姓名"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-dark-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              placeholder="请输入您的邮箱"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              密码
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-dark-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                placeholder="请输入您的密码"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>{isSignUp ? '注册' : '登录'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            {isSignUp ? '已有账户？点击登录' : '没有账户？点击注册'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
