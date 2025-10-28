import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthModal from '@/components/AuthModal';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  auth: {
    currentUser: null,
  },
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const MockedAuthModal = ({ isOpen, onClose, mode }: any) => (
  <AuthProvider>
    <AuthModal isOpen={isOpen} onClose={onClose} mode={mode} />
  </AuthProvider>
);

describe('AuthModal', () => {
  it('renders sign in form by default', () => {
    render(<MockedAuthModal isOpen={true} onClose={jest.fn()} mode="signin" />);
    
    expect(screen.getByText('欢迎回来')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请输入您的邮箱')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请输入您的密码')).toBeInTheDocument();
  });

  it('renders sign up form when mode is signup', () => {
    render(<MockedAuthModal isOpen={true} onClose={jest.fn()} mode="signup" />);
    
    expect(screen.getByText('创建账户')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请输入您的姓名')).toBeInTheDocument();
  });

  it('switches between sign in and sign up modes', () => {
    render(<MockedAuthModal isOpen={true} onClose={jest.fn()} mode="signin" />);
    
    const switchButton = screen.getByText('没有账户？点击注册');
    fireEvent.click(switchButton);
    
    expect(screen.getByText('创建账户')).toBeInTheDocument();
  });

  it('shows/hides password when toggle button is clicked', () => {
    render(<MockedAuthModal isOpen={true} onClose={jest.fn()} mode="signin" />);
    
    const passwordInput = screen.getByPlaceholderText('请输入您的密码');
    const toggleButton = screen.getByRole('button', { name: /show password/i });
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<MockedAuthModal isOpen={true} onClose={onClose} mode="signin" />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });
});

