import songsReducer, {
  fetchSongsRequest,
  fetchSongsSuccess,
  fetchSongsFailure,
  createSongRequest,
  createSongSuccess,
  openModal,
  closeModal,
} from '@store/slices/songsSlice';
import { Song, SongsResponse } from '@types/song';

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

const mockSongsResponse: SongsResponse = {
  data: [mockSong],
  pagination: {
    page: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
};

describe('songsSlice', () => {
  const initialState = {
    songs: [],
    pagination: null,
    loading: false,
    error: null,
    selectedSong: null,
    isModalOpen: false,
    modalMode: null,
  };

  it('should handle fetchSongsRequest', () => {
    const action = fetchSongsRequest({ page: 1, limit: 10 });
    const state = songsReducer(initialState, action);
    
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle fetchSongsSuccess', () => {
    const action = fetchSongsSuccess(mockSongsResponse);
    const state = songsReducer(initialState, action);
    
    expect(state.loading).toBe(false);
    expect(state.songs).toEqual([mockSong]);
    expect(state.pagination).toEqual(mockSongsResponse.pagination);
    expect(state.error).toBe(null);
  });

  it('should handle fetchSongsFailure', () => {
    const errorMessage = 'Failed to fetch songs';
    const action = fetchSongsFailure(errorMessage);
    const state = songsReducer(initialState, action);
    
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should handle createSongRequest', () => {
    const songData = {
      title: 'New Song',
      artist: 'New Artist',
      album: 'New Album',
      year: 2023,
      genre: 'Pop',
      duration: 200,
    };
    const action = createSongRequest(songData);
    const state = songsReducer(initialState, action);
    
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle createSongSuccess', () => {
    const action = createSongSuccess(mockSong);
    const state = songsReducer(initialState, action);
    
    expect(state.loading).toBe(false);
    expect(state.songs).toEqual([mockSong]);
    expect(state.isModalOpen).toBe(false);
    expect(state.modalMode).toBe(null);
  });

  it('should handle openModal', () => {
    const action = openModal({ mode: 'create' });
    const state = songsReducer(initialState, action);
    
    expect(state.isModalOpen).toBe(true);
    expect(state.modalMode).toBe('create');
    expect(state.selectedSong).toBe(null);
  });

  it('should handle openModal with song', () => {
    const action = openModal({ mode: 'edit', song: mockSong });
    const state = songsReducer(initialState, action);
    
    expect(state.isModalOpen).toBe(true);
    expect(state.modalMode).toBe('edit');
    expect(state.selectedSong).toEqual(mockSong);
  });

  it('should handle closeModal', () => {
    const stateWithOpenModal = {
      ...initialState,
      isModalOpen: true,
      modalMode: 'create' as const,
      selectedSong: mockSong,
      error: 'Some error',
    };
    
    const action = closeModal();
    const state = songsReducer(stateWithOpenModal, action);
    
    expect(state.isModalOpen).toBe(false);
    expect(state.modalMode).toBe(null);
    expect(state.selectedSong).toBe(null);
    expect(state.error).toBe(null);
  });
});