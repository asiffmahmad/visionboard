import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as journalService from '../services/journalService';

export const fetchEntries = createAsyncThunk('journal/fetchAll', async (_, thunkAPI) => {
  try {
    return await journalService.getAllEntries();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch journal entries');
  }
});

export const addEntry = createAsyncThunk('journal/add', async (entryData, thunkAPI) => {
  try {
    return await journalService.createEntry(entryData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create entry');
  }
});

export const updateEntry = createAsyncThunk('journal/update', async ({ id, data }, thunkAPI) => {
  try {
    return await journalService.updateEntry(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update entry');
  }
});

export const deleteEntry = createAsyncThunk('journal/delete', async (id, thunkAPI) => {
  try {
    await journalService.deleteEntry(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete entry');
  }
});

const initialState = {
  entries: [],
  loading: false,
  error: null,
};

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addEntry.fulfilled, (state, action) => {
        state.entries.push(action.payload);
      })
      .addCase(updateEntry.fulfilled, (state, action) => {
        const index = state.entries.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
      })
      .addCase(deleteEntry.fulfilled, (state, action) => {
        state.entries = state.entries.filter(e => e.id !== action.payload);
      });
  },
});

export const { clearError } = journalSlice.actions;
export default journalSlice.reducer;
