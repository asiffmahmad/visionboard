import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as goalService from '../services/goalService';

export const fetchGoals = createAsyncThunk('goals/fetchAll', async (_, thunkAPI) => {
  try {
    return await goalService.getAllGoals();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch goals');
  }
});

export const addGoal = createAsyncThunk('goals/add', async (goalData, thunkAPI) => {
  try {
    return await goalService.createGoal(goalData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create goal');
  }
});

export const updateGoal = createAsyncThunk('goals/update', async ({ id, data }, thunkAPI) => {
  try {
    return await goalService.updateGoal(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update goal');
  }
});

export const deleteGoal = createAsyncThunk('goals/delete', async (id, thunkAPI) => {
  try {
    await goalService.deleteGoal(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete goal');
  }
});

const initialState = {
  goals: [],
  loading: false,
  error: null,
};

const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload);
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        const index = state.goals.findIndex(g => g.id === action.payload.id);
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter(g => g.id !== action.payload);
      });
  },
});

export const { clearError } = goalSlice.actions;
export default goalSlice.reducer;
