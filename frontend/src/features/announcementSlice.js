import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as announcementService from '../services/announcementService';

export const fetchActiveAnnouncements = createAsyncThunk('announcements/fetchActive', async (_, thunkAPI) => {
  try {
    return await announcementService.getActiveAnnouncements();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch active announcements');
  }
});

const initialState = {
  activeAnnouncements: [],
  loading: false,
  error: null,
};

const announcementSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.activeAnnouncements = action.payload;
      })
      .addCase(fetchActiveAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default announcementSlice.reducer;
