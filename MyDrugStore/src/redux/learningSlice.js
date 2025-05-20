// Updated learningSlice.js with local storage persistence

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserRecords } from './studyRecordsSlice';
import localStorageService from '../services/localStorageService';

// New async thunks for loading and saving state
export const loadPersistedLearningState = createAsyncThunk(
  'learning/loadPersistedState',
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        console.log('Cannot load learning state: No user ID provided');
        return null;
      }
      
      const savedState = await localStorageService.loadLearningState(userId);
      console.log('Loaded persisted learning state:', savedState ? 'found' : 'not found');
      return savedState;
    } catch (error) {
      console.error('Error loading persisted learning state:', error);
      return rejectWithValue(error.message || 'Failed to load learning state');
    }
  }
);

export const savePersistedLearningState = createAsyncThunk(
  'learning/savePersistedState',
  async (_, { getState }) => {
    try {
      const { learning, auth } = getState();
      if (!auth.user || !auth.user.id) {
        console.log('Cannot save learning state: No user logged in');
        return;
      }
      
      const stateToSave = {
        currentLearning: learning.currentLearning,
        finished: learning.finished
      };
      
      await localStorageService.saveLearningState(auth.user.id, stateToSave);
      console.log('Saved learning state to local storage');
    } catch (error) {
      console.error('Error saving learning state:', error);
    }
  }
);

const initialState = {
  currentLearning: [],
  finished: [],
  loading: false,
  error: null
};

export const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    addToCurrent: (state, action) => {
      // Check if the drug is already in the list
      if (!state.currentLearning.find(drug => drug.id === action.payload.id)) {
        state.currentLearning.push(action.payload);
      }
    },
    moveToFinished: (state, action) => {
      // Remove from current learning
      state.currentLearning = state.currentLearning.filter(
        drug => drug.id !== action.payload.id
      );
      // Add to finished if not already there
      if (!state.finished.find(drug => drug.id === action.payload.id)) {
        state.finished.push(action.payload);
      }
    },
    moveToCurrentFromFinished: (state, action) => {
      // Remove from finished
      state.finished = state.finished.filter(
        drug => drug.id !== action.payload.id
      );
      // Add to current if not already there
      if (!state.currentLearning.find(drug => drug.id === action.payload.id)) {
        state.currentLearning.push(action.payload);
      }
    },
    removeFromCurrent: (state, action) => {
      state.currentLearning = state.currentLearning.filter(
        drug => drug.id !== action.payload.id
      );
    },
    removeFromFinished: (state, action) => {
      state.finished = state.finished.filter(
        drug => drug.id !== action.payload.id
      );
    },
    // Add a new action to reset state when signing out
    clearLearningState: (state) => {
      state.currentLearning = [];
      state.finished = [];
    },
    // Add a new action to initialize the local state from API records
    initializeFromRecords: (state, action) => {
      // Don't reset current state if we already have data
      // This prevents overwriting data loaded from persistence
      if (state.currentLearning.length === 0 && state.finished.length === 0) {
        // Only populate from records if we have valid data
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          console.log('Initializing learning state from records:', action.payload.length);
          
          // Populate from records based on their status
          action.payload.forEach(record => {
            if (record.drug) {
              if (record.status === 'learning') {
                // Avoid duplicates
                if (!state.currentLearning.find(drug => drug.id === record.drug.id)) {
                  state.currentLearning.push(record.drug);
                }
              } else if (record.status === 'finished') {
                // Avoid duplicates
                if (!state.finished.find(drug => drug.id === record.drug.id)) {
                  state.finished.push(record.drug);
                }
              }
            }
          });
          
          console.log('Initialized learning state - Current:', state.currentLearning.length, 'Finished:', state.finished.length);
        } else {
          console.log('No records to initialize from');
        }
      } else {
        console.log('Skipping initializeFromRecords - already have data');
      }
    }
  },
  // Add extra reducers to sync with study records from API
  extraReducers: (builder) => {
    builder
      // Load persisted state
      .addCase(loadPersistedLearningState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPersistedLearningState.fulfilled, (state, action) => {
        state.loading = false;
        // Only update state if we got a valid response
        if (action.payload) {
          // Don't overwrite if we already have data
          if (state.currentLearning.length === 0 && state.finished.length === 0) {
            state.currentLearning = action.payload.currentLearning || [];
            state.finished = action.payload.finished || [];
            console.log('Restored learning state from persistence - Current:', 
              state.currentLearning.length, 'Finished:', state.finished.length);
          } else {
            console.log('Skipped loading persisted state - already have data');
          }
        }
      })
      .addCase(loadPersistedLearningState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // When user records are fetched from API, update local learning state
      .addCase(fetchUserRecords.fulfilled, (state, action) => {
        // Only process if we have valid records
        if (Array.isArray(action.payload)) {
          console.log('Initializing learning state from records:', action.payload.length);
          
          // Don't completely reset if we already have data
          if (state.currentLearning.length === 0 && state.finished.length === 0) {
            // Populate from records
            action.payload.forEach(record => {
              // If there's a drug object in the record
              if (record.drug) {
                if (record.status === 'learning') {
                  // Add to current learning if not already there
                  if (!state.currentLearning.find(drug => drug.id === record.drug.id)) {
                    state.currentLearning.push(record.drug);
                  }
                } else if (record.status === 'finished') {
                  // Add to finished if not already there
                  if (!state.finished.find(drug => drug.id === record.drug.id)) {
                    state.finished.push(record.drug);
                  }
                }
              }
            });
            
            console.log('Initialized learning state - Current:', state.currentLearning.length, 'Finished:', state.finished.length);
          } else {
            console.log('Skipped initialization from records - already have data');
          }
        }
      });
  }
});

export const { 
  addToCurrent, 
  moveToFinished, 
  moveToCurrentFromFinished, 
  removeFromCurrent,
  removeFromFinished,
  initializeFromRecords,
  clearLearningState
} = learningSlice.actions;

export default learningSlice.reducer;