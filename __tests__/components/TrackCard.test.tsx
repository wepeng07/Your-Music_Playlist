import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrackCard from '@/components/TrackCard';
import { PlayerProvider } from '@/contexts/PlayerContext';
import { Track } from '@/types';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const mockTrack: Track = {
  id: '1',
  title: 'Test Song',
  artist: 'Test Artist',
  duration: 180,
  youtubeId: 'test123',
  thumbnail: 'https://example.com/thumb.jpg',
  genre: ['pop'],
  mood: ['happy'],
  popularity: 85,
};

const MockedTrackCard = ({ track, showIndex, index }: any) => (
  <PlayerProvider>
    <TrackCard track={track} showIndex={showIndex} index={index} />
  </PlayerProvider>
);

describe('TrackCard', () => {
  it('renders track information correctly', () => {
    render(<MockedTrackCard track={mockTrack} showIndex={false} index={0} />);
    
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('3:00')).toBeInTheDocument();
  });

  it('shows index when showIndex is true', () => {
    render(<MockedTrackCard track={mockTrack} showIndex={true} index={5} />);
    
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('displays genre information when available', () => {
    render(<MockedTrackCard track={mockTrack} showIndex={false} index={0} />);
    
    expect(screen.getByText('pop')).toBeInTheDocument();
  });

  it('shows play button on hover', () => {
    render(<MockedTrackCard track={mockTrack} showIndex={false} index={0} />);
    
    const trackCard = screen.getByRole('button', { name: /play/i });
    expect(trackCard).toBeInTheDocument();
  });

  it('shows like and more options buttons on hover', () => {
    render(<MockedTrackCard track={mockTrack} showIndex={false} index={0} />);
    
    const likeButton = screen.getByRole('button', { name: /like/i });
    const moreButton = screen.getByRole('button', { name: /more/i });
    
    expect(likeButton).toBeInTheDocument();
    expect(moreButton).toBeInTheDocument();
  });
});

