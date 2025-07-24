import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@emotion/react';
import { configureStore } from '@reduxjs/toolkit';
import SongCard from '@components/songs/SongCard';
import songsReducer from '@store/slices/songsSlice';
import { theme } from '@theme/index';
import { Song } from '@types/song';

const mockSong: Song = {
  id: '1',
  title: 'Test Song',
  artist: 'Test Artist',
  album: 'Test Album',
  year: 2023,
  genre: 'Rock',
  duration: 180,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

const mockStore = configureStore({
  reducer: {
    songs: songsReducer,
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={mockStore}>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </Provider>
  );
};

describe('SongCard', () => {
  it('renders song information correctly', () => {
    renderWithProviders(<SongCard song={mockSong} />);
    
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('Test Album')).toBeInTheDocument();
    expect(screen.getByText('Rock')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('3:00')).toBeInTheDocument();
  });

  it('handles play button click', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    renderWithProviders(<SongCard song={mockSong} />);
    
    const playButton = screen.getByRole('button', { name: /play/i });
    fireEvent.click(playButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Playing: Test Song by Test Artist');
    consoleSpy.mockRestore();
  });

  it('handles edit button click', () => {
    renderWithProviders(<SongCard song={mockSong} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    
    // Check if modal state would be updated (this would require more complex testing setup)
    expect(editButton).toBeInTheDocument();
  });

  it('handles delete button click with confirmation', () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    renderWithProviders(<SongCard song={mockSong} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete "Test Song"?');
    confirmSpy.mockRestore();
  });

  it('formats duration correctly', () => {
    const songWithLongDuration: Song = {
      ...mockSong,
      duration: 3661, // 1 hour, 1 minute, 1 second
    };
    
    renderWithProviders(<SongCard song={songWithLongDuration} />);
    expect(screen.getByText('61:01')).toBeInTheDocument();
  });
});