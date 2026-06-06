import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as noteService from '../services/noteService';

export const fetchNotes = createAsyncThunk('notes/fetchAll', async (_, thunkAPI) => {
  try {
    return await noteService.getAllNotes();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch notes');
  }
});

export const addNote = createAsyncThunk('notes/add', async (noteData, thunkAPI) => {
  try {
    return await noteService.createNote(noteData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create note');
  }
});

export const updateNote = createAsyncThunk('notes/update', async ({ id, data }, thunkAPI) => {
  try {
    return await noteService.updateNote(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update note');
  }
});

export const deleteNote = createAsyncThunk('notes/delete', async (id, thunkAPI) => {
  try {
    await noteService.deleteNote(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete note');
  }
});

const initialState = {
  notes: [],
  loading: false,
  error: null,
};

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.notes.push(action.payload);
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.notes.findIndex(n => n.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter(n => n.id !== action.payload);
      });
  },
});

export const { clearError } = noteSlice.actions;
export default noteSlice.reducer;
