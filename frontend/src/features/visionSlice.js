import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as visionService from '../services/visionService';

export const fetchVisions = createAsyncThunk('visions/fetchAll', async (_, thunkAPI) => {
  try {
    return await visionService.getAllVisions();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch visions');
  }
});

export const addVision = createAsyncThunk('visions/add', async (visionData, thunkAPI) => {
  try {
    return await visionService.createVision(visionData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create vision');
  }
});

export const updateVision = createAsyncThunk('visions/update', async ({ id, data }, thunkAPI) => {
  try {
    return await visionService.updateVision(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update vision');
  }
});

export const deleteVision = createAsyncThunk('visions/delete', async (id, thunkAPI) => {
  try {
    await visionService.deleteVision(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete vision');
  }
});

const initialState = {
  visions: [],
  loading: false,
  error: null,
};

const visionSlice = createSlice({
  name: 'visions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisions.fulfilled, (state, action) => {
        state.loading = false;
        state.visions = action.payload;
      })
      .addCase(fetchVisions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addVision.fulfilled, (state, action) => {
        state.visions.push(action.payload);
      })
      .addCase(updateVision.fulfilled, (state, action) => {
        const index = state.visions.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.visions[index] = action.payload;
        }
      })
      .addCase(deleteVision.fulfilled, (state, action) => {
        state.visions = state.visions.filter(v => v.id !== action.payload);
      });
  },
});

export const { clearError } = visionSlice.actions;
export default visionSlice.reducer;
