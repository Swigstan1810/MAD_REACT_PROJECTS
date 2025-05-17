import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studyRecordsService } from '../services/api';

// Async thunks for study records
export const fetchUserRecords = createAsyncThunk(
  'studyRecords/fetchUserRecords',
  async (_, { rejectWithValue }) => {
    try {
      const response = await studyRecordsService.getUserRecords();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch records');
    }
  }
);

export const addDrugToLearning = createAsyncThunk(
  'studyRecords/addDrugToLearning',
  async (drugId, { rejectWithValue }) => {
    try {
      const response = await studyRecordsService.addToLearning(drugId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add drug');
    }
  }
);

export const updateDrugStatus = createAsyncThunk(
  'studyRecords/updateDrugStatus',
  async ({ recordId, status }, { rejectWithValue }) => {
    try {
      const response = await studyRecordsService.updateLearningStatus(recordId, status);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update status');
    }
  }
);

export const addPronunciationScore = createAsyncThunk(
  'studyRecords/addPronunciationScore',
  async ({ recordId, score }, { rejectWithValue }) => {
    try {
      const response = await studyRecordsService.addPronunciationScore(recordId, score);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add score');
    }
  }
);

export const removeDrugFromLearning = createAsyncThunk(
  'studyRecords/removeDrugFromLearning',
  async (recordId, { rejectWithValue }) => {
    try {
      const response = await studyRecordsService.removeFromLearning(recordId);
      return recordId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove drug');
    }
  }
);

// Initial state
const initialState = {
  records: [],
  loading: false,
  error: null
};

// Study records slice
const studyRecordsSlice = createSlice({
  name: 'studyRecords',
  initialState,
  reducers: {
    clearStudyRecords: (state) => {
      state.records = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user records
      .addCase(fetchUserRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchUserRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add drug to learning
      .addCase(addDrugToLearning.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDrugToLearning.fulfilled, (state, action) => {
        state.loading = false;
        state.records.push(action.payload);
      })
      .addCase(addDrugToLearning.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update drug status
      .addCase(updateDrugStatus.fulfilled, (state, action) => {
        const index = state.records.findIndex(record => record.id === action.payload.id);
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      })
      
      // Add pronunciation score
      .addCase(addPronunciationScore.fulfilled, (state, action) => {
        const index = state.records.findIndex(record => record.id === action.payload.id);
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      })
      
      // Remove drug from learning
      .addCase(removeDrugFromLearning.fulfilled, (state, action) => {
        state.records = state.records.filter(record => record.id !== action.payload);
      });
  }
});

export const { clearStudyRecords } = studyRecordsSlice.actions;

export default studyRecordsSlice.reducer;