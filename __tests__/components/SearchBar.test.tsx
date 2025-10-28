import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '@/components/SearchBar';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();
  const mockOnAIRecommend = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
    mockOnAIRecommend.mockClear();
  });

  it('renders search input and button', () => {
    render(
      <SearchBar 
        onSearch={mockOnSearch} 
        onAIRecommend={mockOnAIRecommend} 
      />
    );
    
    expect(screen.getByPlaceholderText('搜索歌曲、艺术家或专辑...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /搜索/i })).toBeInTheDocument();
  });

  it('calls onSearch when form is submitted in normal mode', async () => {
    render(
      <SearchBar 
        onSearch={mockOnSearch} 
        onAIRecommend={mockOnAIRecommend} 
      />
    );
    
    const input = screen.getByPlaceholderText('搜索歌曲、艺术家或专辑...');
    const submitButton = screen.getByRole('button', { name: /搜索/i });
    
    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test query');
    });
  });

  it('switches to AI recommendation mode', () => {
    render(
      <SearchBar 
        onSearch={mockOnSearch} 
        onAIRecommend={mockOnAIRecommend} 
      />
    );
    
    const aiButton = screen.getByText('AI推荐');
    fireEvent.click(aiButton);
    
    expect(screen.getByPlaceholderText('描述你想要的音乐...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /AI推荐/i })).toBeInTheDocument();
  });

  it('shows example prompts in AI mode', () => {
    render(
      <SearchBar 
        onSearch={mockOnSearch} 
        onAIRecommend={mockOnAIRecommend} 
      />
    );
    
    const aiButton = screen.getByText('AI推荐');
    fireEvent.click(aiButton);
    
    expect(screen.getByText('试试这些示例：')).toBeInTheDocument();
    expect(screen.getByText('适合学习的轻音乐')).toBeInTheDocument();
  });

  it('calls onAIRecommend when form is submitted in AI mode', async () => {
    render(
      <SearchBar 
        onSearch={mockOnSearch} 
        onAIRecommend={mockOnAIRecommend} 
      />
    );
    
    const aiButton = screen.getByText('AI推荐');
    fireEvent.click(aiButton);
    
    const input = screen.getByPlaceholderText('描述你想要的音乐...');
    const submitButton = screen.getByRole('button', { name: /AI推荐/i });
    
    fireEvent.change(input, { target: { value: 'relaxing music' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnAIRecommend).toHaveBeenCalledWith('relaxing music');
    });
  });

  it('shows filters when filter button is clicked', () => {
    render(
      <SearchBar 
        onSearch={mockOnSearch} 
        onAIRecommend={mockOnAIRecommend} 
      />
    );
    
    const filterButton = screen.getByText('筛选');
    fireEvent.click(filterButton);
    
    expect(screen.getByText('筛选条件')).toBeInTheDocument();
    expect(screen.getByText('音乐类型')).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', () => {
    render(
      <SearchBar 
        onSearch={mockOnSearch} 
        onAIRecommend={mockOnAIRecommend} 
      />
    );
    
    const input = screen.getByPlaceholderText('搜索歌曲、艺术家或专辑...');
    fireEvent.change(input, { target: { value: 'test query' } });
    
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);
    
    expect(input).toHaveValue('');
  });
});

