import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as habitService from '../services/habitService';

export const fetchHabits = createAsyncThunk('habits/fetchAll', async (_, thunkAPI) => {
  try {
    return await habitService.getAllHabits();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch habits');
  }
});

export const addHabit = createAsyncThunk('habits/add', async (habitData, thunkAPI) => {
  try {
    return await habitService.createHabit(habitData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create habit');
  }
});

export const updateHabit = createAsyncThunk('habits/update', async ({ id, data }, thunkAPI) => {
  try {
    return await habitService.updateHabit(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update habit');
  }
});

export const deleteHabit = createAsyncThunk('habits/delete', async (id, thunkAPI) => {
  try {
    await habitService.deleteHabit(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete habit');
  }
});

export const logHabit = createAsyncThunk('habits/log', async ({ id, date, completed }, thunkAPI) => {
  try {
    return await habitService.logHabit(id, date, completed);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to log habit');
  }
});
export const skipHabit = createAsyncThunk('habits/skip', async ({ id, date, reason, notes }, thunkAPI) => {
  try {
    return await habitService.skipHabit(id, date, reason, notes);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to skip habit');
  }
});

export const fetchHabitAnalytics = createAsyncThunk('habits/fetchAnalytics', async (id, thunkAPI) => {
  try {
    return await habitService.getHabitAnalytics(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
  }
});

export const fetchHabitTimeline = createAsyncThunk('habits/fetchTimeline', async (id, thunkAPI) => {
  try {
    return await habitService.getHabitTimeline(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch timeline');
  }
});

export const fetchHabitHeatmap = createAsyncThunk('habits/fetchHeatmap', async (id, thunkAPI) => {
  try {
    return await habitService.getHabitHeatmap(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch heatmap');
  }
});

export const fetchHabitAchievements = createAsyncThunk('habits/fetchAchievements', async (id, thunkAPI) => {
  try {
    return await habitService.getHabitAchievements(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch achievements');
  }
});
const initialState = {
  habits: [],
  analytics: null,
  timeline: [],
  heatmap: [],
  achievements: [],
  loading: false,
  error: null,
};

const habitSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAnalyticsState: (state) => {
      state.analytics = null;
      state.timeline = [];
      state.heatmap = [];
      state.achievements = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.loading = false;
        state.habits = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addHabit.fulfilled, (state, action) => {
        state.habits.push(action.payload);
      })
      .addCase(updateHabit.fulfilled, (state, action) => {
        const index = state.habits.findIndex(h => h.id === action.payload.id);
        if (index !== -1) {
          state.habits[index] = action.payload;
        }
      })
      .addCase(logHabit.fulfilled, (state, action) => {
        const index = state.habits.findIndex(h => h.id === action.payload.id);
        if (index !== -1) {
          state.habits[index] = action.payload;
        }
      })
      .addCase(skipHabit.fulfilled, (state, action) => {
        const index = state.habits.findIndex(h => h.id === action.payload.id);
        if (index !== -1) {
          state.habits[index] = action.payload;
        }
      })
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.habits = state.habits.filter(h => h.id !== action.payload);
      })
      .addCase(fetchHabitAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      })
      .addCase(fetchHabitTimeline.fulfilled, (state, action) => {
        state.timeline = action.payload;
      })
      .addCase(fetchHabitHeatmap.fulfilled, (state, action) => {
        state.heatmap = action.payload;
      })
      .addCase(fetchHabitAchievements.fulfilled, (state, action) => {
        state.achievements = action.payload;
      });
  },
});

export const { clearError, clearAnalyticsState } = habitSlice.actions;
export default habitSlice.reducer;
