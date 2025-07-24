import { Song, CreateSongRequest, UpdateSongRequest, SongsResponse } from '@types/song';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new ApiError(errorData.message || 'API Error', response.status);
  }
  return response.json();
};

export const fetchSongs = async (page: number = 1, limit: number = 10): Promise<SongsResponse> => {
  const response = await fetch(`${API_BASE_URL}/songs?page=${page}&limit=${limit}`);
  return handleResponse(response);
};

export const createSong = async (songData: CreateSongRequest): Promise<Song> => {
  const response = await fetch(`${API_BASE_URL}/songs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(songData),
  });
  return handleResponse(response);
};

export const updateSong = async (id: string, songData: Partial<CreateSongRequest>): Promise<Song> => {
  const response = await fetch(`${API_BASE_URL}/songs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(songData),
  });
  return handleResponse(response);
};

export const deleteSong = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/songs/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new ApiError(errorData.message || 'Failed to delete song', response.status);
  }
};

export const getSong = async (id: string): Promise<Song> => {
  const response = await fetch(`${API_BASE_URL}/songs/${id}`);
  return handleResponse(response);
};