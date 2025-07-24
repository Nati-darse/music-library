import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Song, SongsResponse, CreateSongRequest, UpdateSongRequest, PaginationInfo } from '@types/song';

interface SongsState {
  songs: Song[];
  pagination: PaginationInfo | null;
  loading: boolean;
  error: string | null;
  selectedSong: Song | null;
  isModalOpen: boolean;
  modalMode: 'create' | 'edit' | 'view' | null;
}

const initialState: SongsState = {
  songs: [],
  pagination: null,
  loading: false,
  error: null,
  selectedSong: null,
  isModalOpen: false,
  modalMode: null,
};

const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    // Fetch songs actions
    fetchSongsRequest: (state, action: PayloadAction<{ page?: number; limit?: number }>) => {
      state.loading = true;
      state.error = null;
    },
    fetchSongsSuccess: (state, action: PayloadAction<SongsResponse>) => {
      state.loading = false;
      state.songs = action.payload.data;
      state.pagination = action.payload.pagination;
      state.error = null;
    },
    fetchSongsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create song actions
    createSongRequest: (state, action: PayloadAction<CreateSongRequest>) => {
      state.loading = true;
      state.error = null;
    },
    createSongSuccess: (state, action: PayloadAction<Song>) => {
      state.loading = false;
      state.songs.unshift(action.payload);
      state.error = null;
      state.isModalOpen = false;
      state.modalMode = null;
    },
    createSongFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update song actions
    updateSongRequest: (state, action: PayloadAction<UpdateSongRequest>) => {
      state.loading = true;
      state.error = null;
    },
    updateSongSuccess: (state, action: PayloadAction<Song>) => {
      state.loading = false;
      const index = state.songs.findIndex(song => song.id === action.payload.id);
      if (index !== -1) {
        state.songs[index] = action.payload;
      }
      state.error = null;
      state.isModalOpen = false;
      state.modalMode = null;
      state.selectedSong = null;
    },
    updateSongFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete song actions
    deleteSongRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    deleteSongSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.songs = state.songs.filter(song => song.id !== action.payload);
      state.error = null;
    },
    deleteSongFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Modal actions
    openModal: (state, action: PayloadAction<{ mode: 'create' | 'edit' | 'view'; song?: Song }>) => {
      state.isModalOpen = true;
      state.modalMode = action.payload.mode;
      state.selectedSong = action.payload.song || null;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalMode = null;
      state.selectedSong = null;
      state.error = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchSongsRequest,
  fetchSongsSuccess,
  fetchSongsFailure,
  createSongRequest,
  createSongSuccess,
  createSongFailure,
  updateSongRequest,
  updateSongSuccess,
  updateSongFailure,
  deleteSongRequest,
  deleteSongSuccess,
  deleteSongFailure,
  openModal,
  closeModal,
  clearError,
} = songsSlice.actions;

export default songsSlice.reducer;