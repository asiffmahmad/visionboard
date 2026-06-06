import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as adminService from '../services/adminService';

// Announcements
export const fetchAllAnnouncements = createAsyncThunk('admin/fetchAllAnnouncements', async (_, thunkAPI) => {
  try {
    return await adminService.getAllAnnouncements();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch announcements');
  }
});

export const addAnnouncement = createAsyncThunk('admin/addAnnouncement', async (data, thunkAPI) => {
  try {
    return await adminService.createAnnouncement(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create announcement');
  }
});

export const updateAnnouncement = createAsyncThunk('admin/updateAnnouncement', async ({ id, data }, thunkAPI) => {
  try {
    return await adminService.updateAnnouncement(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update announcement');
  }
});

export const deleteAnnouncement = createAsyncThunk('admin/deleteAnnouncement', async (id, thunkAPI) => {
  try {
    await adminService.deleteAnnouncement(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete announcement');
  }
});

// Feature Flags
export const fetchFeatureFlags = createAsyncThunk('admin/fetchFeatureFlags', async (_, thunkAPI) => {
  try {
    return await adminService.getAllFeatureFlags();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch feature flags');
  }
});

export const updateGlobalFlag = createAsyncThunk('admin/updateGlobalFlag', async ({ featureName, enabled }, thunkAPI) => {
  try {
    return await adminService.updateGlobalFlag(featureName, enabled);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update feature flag');
  }
});

export const overrideUserFeature = createAsyncThunk('admin/overrideUserFeature', async ({ userId, featureName, enabled }, thunkAPI) => {
  try {
    return await adminService.overrideUserFeature(userId, featureName, enabled);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to override user feature');
  }
});

export const removeUserOverride = createAsyncThunk('admin/removeUserOverride', async ({ userId, featureName }, thunkAPI) => {
  try {
    await adminService.removeUserOverride(userId, featureName);
    return { userId, featureName };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to remove user override');
  }
});

const initialState = {
  announcements: [],
  featureFlags: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Announcements
      .addCase(fetchAllAnnouncements.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllAnnouncements.fulfilled, (state, action) => { state.loading = false; state.announcements = action.payload; })
      .addCase(fetchAllAnnouncements.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addAnnouncement.fulfilled, (state, action) => { state.announcements.push(action.payload); })
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        const index = state.announcements.findIndex(a => a.id === action.payload.id);
        if (index !== -1) state.announcements[index] = action.payload;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.announcements = state.announcements.filter(a => a.id !== action.payload);
      })
      // Feature Flags
      .addCase(fetchFeatureFlags.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchFeatureFlags.fulfilled, (state, action) => { state.loading = false; state.featureFlags = action.payload; })
      .addCase(fetchFeatureFlags.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateGlobalFlag.fulfilled, (state, action) => {
        const index = state.featureFlags.findIndex(f => f.id === action.payload.id);
        if (index !== -1) state.featureFlags[index] = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
