// Updated studyRecordsSlice.js with local storage persistence

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studyRecordsService } from '../services/api';
import localStorageService from '../services/localStorageService';

// New async thunks for loading and saving state
export const loadPersistedRecords = createAsyncThunk(
  'studyRecords/loadPersistedRecords',
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        console.log('Cannot load study records: No user ID provided');
        return null;
      }
      
      const savedRecords = await localStorageService.loadUserRecords(userId);
      console.log('Loaded persisted study records:', savedRecords ? 'found' : 'not found');
      return savedRecords;
    } catch (error) {
      console.error('Error loading persisted study records:', error);
      return rejectWithValue(error.message || 'Failed to load study records');
    }
  }
);

export const savePersistedRecords = createAsyncThunk(
  'studyRecords/savePersistedRecords',
  async (_, { getState }) => {
    try {
      const { studyRecords, auth } = getState();
      if (!auth.user || !auth.user.id) {
        console.log('Cannot save study records: No user logged in');
        return;
      }
      
      await localStorageService.saveUserRecords(auth.user.id, studyRecords.records);
      console.log('Saved study records to local storage');
    } catch (error) {
      console.error('Error saving study records:', error);
    }
  }
);

// Async thunks for study records
export const fetchUserRecords = createAsyncThunk(
  'studyRecords/fetchUserRecords',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      // Check if the user is authenticated first
      const { isAuthenticated, user } = getState().auth;
      if (!isAuthenticated || !user) {
        console.log('Cannot fetch records: User not authenticated');
        return [];
      }
      
      // Try to load persisted records first
      const persistedRecords = await localStorageService.loadUserRecords(user.id);
      if (persistedRecords && persistedRecords.length > 0) {
        console.log('Using persisted records:', persistedRecords.length);
      }
      
      // Then fetch from the API
      console.log('Fetching user records from API for user:', user.id);
      const response = await studyRecordsService.getUserRecords();
      console.log(`Retrieved ${response?.length || 0} user records from API`);
      
      // Make sure we have a valid response
      if (!Array.isArray(response)) {
        console.warn('API returned non-array response for records:', response);
        return persistedRecords || [];
      }
      
      // If we got records from the API, save them to local storage
      if (response.length > 0) {
        dispatch(savePersistedRecords());
        return response;
      }
      
      // If API returned empty array but we have persisted records, use those
      if (persistedRecords && persistedRecords.length > 0) {
        console.log('API returned no records but using persisted records');
        return persistedRecords;
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching user records:', error);
      // Try to use persisted records in case of error
      try {
        const { user } = getState().auth;
        if (user && user.id) {
          const persistedRecords = await localStorageService.loadUserRecords(user.id);
          if (persistedRecords && persistedRecords.length > 0) {
            console.log('Using persisted records due to API error');
            return persistedRecords;
          }
        }
      } catch (storageError) {
        console.error('Error loading persisted records:', storageError);
      }
      
      return rejectWithValue(error.message || 'Failed to fetch records');
    }
  }
);

export const addDrugToLearning = createAsyncThunk(
  'studyRecords/addDrugToLearning',
  async (drugId, { rejectWithValue, getState, dispatch }) => {
    try {
      // Check if the user is authenticated first
      const { isAuthenticated } = getState().auth;
      if (!isAuthenticated) {
        console.log('Cannot add drug: User not authenticated');
        return null;
      }
      
      const response = await studyRecordsService.addToLearning(drugId);
      console.log(`Added drug ${drugId} to learning list`, response);
      
      // Save updated records to local storage
      if (response) {
        dispatch(savePersistedRecords());
      }
      
      return response;
    } catch (error) {
      console.error('Error adding drug to learning:', error);
      return rejectWithValue(error.message || 'Failed to add drug');
    }
  }
);

export const updateDrugStatus = createAsyncThunk(
  'studyRecords/updateDrugStatus',
  async ({ recordId, updateData }, { rejectWithValue, getState, dispatch }) => {
    try {
      // Check if the user is authenticated first
      const { isAuthenticated } = getState().auth;
      if (!isAuthenticated) {
        console.log('Cannot update drug status: User not authenticated');
        return null;
      }
      
      // Format the updateData according to api.js expectations
      const formattedData = {
        currentLearning: updateData.currentLearning || 0,
        finishedLearning: updateData.finishedLearning || 0,
        totalScore: updateData.totalScore || 0
      };
      
      console.log(`Updating drug status for record ${recordId}:`, formattedData);
      const response = await studyRecordsService.updateLearningStatus(recordId, formattedData);
      
      // Make sure we explicitly return the status for the reducer to use
      const result = {
        id: recordId,
        ...response,
        status: updateData.currentLearning > 0 ? 'learning' : 'finished',
        currentLearning: updateData.currentLearning,
        finishedLearning: updateData.finishedLearning,
        totalScore: updateData.totalScore
      };
      
      // Save updated records to local storage
      dispatch(savePersistedRecords());
      
      return result;
    } catch (error) {
      console.error('Error updating drug status:', error);
      return rejectWithValue(error.message || 'Failed to update status');
    }
  }
);


export const addPronunciationScore = createAsyncThunk(
  'studyRecords/addPronunciationScore',
  async ({ recordId, score }, { rejectWithValue, getState, dispatch }) => {
    try {
      // Check if the user is authenticated first
      const { isAuthenticated } = getState().auth;
      if (!isAuthenticated) {
        console.log('Cannot add pronunciation score: User not authenticated');
        return null;
      }
      
      console.log(`Adding pronunciation score ${score} for record ${recordId}`);
      const response = await studyRecordsService.addPronunciationScore(recordId, score);
      
      // Save updated records to local storage
      dispatch(savePersistedRecords());
      
      return {
        id: recordId,
        score,
        ...response
      };
    } catch (error) {
      console.error('Error adding pronunciation score:', error);
      return rejectWithValue(error.message || 'Failed to add score');
    }
  }
);

export const removeDrugFromLearning = createAsyncThunk(
  'studyRecords/removeDrugFromLearning',
  async (recordId, { rejectWithValue, getState, dispatch }) => {
    try {
      // Check if the user is authenticated first
      const { isAuthenticated } = getState().auth;
      if (!isAuthenticated) {
        console.log('Cannot remove drug: User not authenticated');
        return null;
      }
      
      console.log(`Removing drug with record ID ${recordId} from learning list`);
      await studyRecordsService.removeFromLearning(recordId);
      
      // Save updated records to local storage
      dispatch(savePersistedRecords());
      
      return recordId;
    } catch (error) {
      console.error('Error removing drug from learning:', error);
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
      console.log('Clearing study records state');
      state.records = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Load persisted records
      .addCase(loadPersistedRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPersistedRecords.fulfilled, (state, action) => {
        state.loading = false;
        // Only update state if we got a valid response
        if (action.payload && Array.isArray(action.payload)) {
          // Don't overwrite if we already have data
          if (state.records.length === 0) {
            state.records = action.payload;
            console.log('Restored study records from persistence:', state.records.length);
          } else {
            console.log('Skipped loading persisted records - already have data');
          }
        }
      })
      .addCase(loadPersistedRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch user records
      .addCase(fetchUserRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRecords.fulfilled, (state, action) => {
        state.loading = false;
        // Only update if we have valid data
        if (Array.isArray(action.payload)) {
          state.records = action.payload;
          console.log('Updated records state with', action.payload.length, 'records');
        } else {
          console.warn('Received non-array payload for fetchUserRecords:', action.payload);
        }
      })
      .addCase(fetchUserRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('fetchUserRecords rejected with error:', action.payload);
      })
      
      // Add drug to learning
      .addCase(addDrugToLearning.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDrugToLearning.fulfilled, (state, action) => {
        state.loading = false;
        // Only add if we have a valid response
        if (action.payload) {
          state.records.push(action.payload);
          console.log('Added drug to records:', action.payload);
        }
      })
      .addCase(addDrugToLearning.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update drug status
      .addCase(updateDrugStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDrugStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Only update if we have a valid response
        if (action.payload && action.payload.id) {
          const index = state.records.findIndex(record => record.id === action.payload.id);
          if (index !== -1) {
            console.log("Updating record status to:", action.payload.status);
            // Update the record with the new status
            state.records[index] = {
              ...state.records[index],
              status: action.payload.status,
              currentLearning: action.payload.currentLearning,
              finishedLearning: action.payload.finishedLearning,
              totalScore: action.payload.totalScore
            };
          } else {
            console.log("Record not found for id:", action.payload.id);
          }
        }
      })
      .addCase(updateDrugStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add pronunciation score
      .addCase(addPronunciationScore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPronunciationScore.fulfilled, (state, action) => {
        state.loading = false;
        // Only update if we have a valid response
        if (action.payload && action.payload.id) {
          const index = state.records.findIndex(record => record.id === action.payload.id);
          if (index !== -1) {
            // Update the highest score if the new score is higher
            state.records[index] = {
              ...state.records[index],
              highestScore: Math.max(
                state.records[index].highestScore || 0, 
                action.payload.score
              )
            };
          }
        }
      })
      .addCase(addPronunciationScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Remove drug from learning
      .addCase(removeDrugFromLearning.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeDrugFromLearning.fulfilled, (state, action) => {
        state.loading = false;
        // Only update if we have a valid response
        if (action.payload) {
          state.records = state.records.filter(record => record.id !== action.payload);
        }
      })
      .addCase(removeDrugFromLearning.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearStudyRecords, clearError } = studyRecordsSlice.actions;

export default studyRecordsSlice.reducer;