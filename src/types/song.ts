export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  genre: string;
  duration: number; // in seconds
  createdAt: string;
  updatedAt: string;
}

export interface CreateSongRequest {
  title: string;
  artist: string;
  album: string;
  year: number;
  genre: string;
  duration: number;
}

export interface UpdateSongRequest extends Partial<CreateSongRequest> {
  id: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SongsResponse {
  data: Song[];
  pagination: PaginationInfo;
}

export interface ApiError {
  message: string;
  status: number;
}