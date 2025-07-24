import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import * as songsApi from '@services/songsApi';
import {
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
} from '../slices/songsSlice';
import { CreateSongRequest, UpdateSongRequest, SongsResponse, Song } from '@types/song';

function* fetchSongsSaga(action: PayloadAction<{ page?: number; limit?: number }>) {
  try {
    const { page = 1, limit = 10 } = action.payload;
    const response: SongsResponse = yield call(songsApi.fetchSongs, page, limit);
    yield put(fetchSongsSuccess(response));
  } catch (error: any) {
    yield put(fetchSongsFailure(error.message || 'Failed to fetch songs'));
  }
}

function* createSongSaga(action: PayloadAction<CreateSongRequest>) {
  try {
    const song: Song = yield call(songsApi.createSong, action.payload);
    yield put(createSongSuccess(song));
  } catch (error: any) {
    yield put(createSongFailure(error.message || 'Failed to create song'));
  }
}

function* updateSongSaga(action: PayloadAction<UpdateSongRequest>) {
  try {
    const song: Song = yield call(songsApi.updateSong, action.payload.id, action.payload);
    yield put(updateSongSuccess(song));
  } catch (error: any) {
    yield put(updateSongFailure(error.message || 'Failed to update song'));
  }
}

function* deleteSongSaga(action: PayloadAction<string>) {
  try {
    yield call(songsApi.deleteSong, action.payload);
    yield put(deleteSongSuccess(action.payload));
  } catch (error: any) {
    yield put(deleteSongFailure(error.message || 'Failed to delete song'));
  }
}

export function* songsSaga() {
  yield takeLatest(fetchSongsRequest.type, fetchSongsSaga);
  yield takeEvery(createSongRequest.type, createSongSaga);
  yield takeEvery(updateSongRequest.type, updateSongSaga);
  yield takeEvery(deleteSongRequest.type, deleteSongSaga);
}