import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/api';
import localStorageService from '../services/localStorageService';
import { loadPersistedLearningState, savePersistedLearningState } from './learningSlice';
import { loadPersistedRecords, savePersistedRecords } from './studyRecordsSlice';

// Async thunks for authentication
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (userData, { rejectWithValue }) => {
    try {
      // Updated to use username consistently
      const formattedUserData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        gender: userData.gender
      };
      
      console.log('Signing up with data:', {...formattedUserData, password: '******'});
      const response = await authService.signUp(formattedUserData);
      console.log('Signup response:', response);
      return response;
    } catch (error) {
      console.error('Signup error in thunk:', error);
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      // Ensure we're using the API format expected in api.js
      const loginData = {
        email: credentials.email,
        password: credentials.password
      };
      
      console.log('Signing in with email:', credentials.email);
      const response = await authService.signIn(loginData);
      console.log('Sign in successful with user data:', response.user);
      
      // After successful sign-in, load persisted state and then fetch records
      if (response.user && response.user.id) {
        // Load persisted learning state
        console.log('Loading persisted state for user:', response.user.id);
        dispatch(loadPersistedLearningState(response.user.id));
        
        // Load persisted study records
        dispatch(loadPersistedRecords(response.user.id));
        
        // Fetch fresh records from the API
        setTimeout(() => {
          console.log('Fetching fresh records from API');
          dispatch({ type: 'studyRecords/fetchUserRecords' });
        }, 500);
      }
      
      return response;
    } catch (error) {
      console.error('Sign in error in thunk:', error);
      return rejectWithValue(error.message || 'Authentication failed');
    }
  }
);

// Updated sign out action with persistence
export const signOut = () => async (dispatch, getState) => {
  try {
    // Save state before signing out
    const { auth, learning } = getState();
    
    if (auth.user && auth.user.id) {
      const userId = auth.user.id;
      console.log('Saving state before sign out for user:', userId);
      
      // If there's any learning data, save it
      if (learning.currentLearning.length > 0 || learning.finished.length > 0) {
        console.log('Persisting learning state before sign out');
        const stateToSave = {
          currentLearning: learning.currentLearning,
          finished: learning.finished
        };
        await localStorageService.saveLearningState(userId, stateToSave);
      }
      
      // Same for study records
      const { studyRecords } = getState();
      if (studyRecords.records.length > 0) {
        console.log('Persisting study records before sign out');
        await localStorageService.saveUserRecords(userId, studyRecords.records);
      }
    }
    
    // Now sign out
    await authService.signOut();
    
    // Clear auth state
    dispatch({ type: 'auth/signOut' });
    
    // Also clear study records when signing out
    dispatch({ type: 'studyRecords/clearStudyRecords' });
    
    // Clear learning state
    dispatch({ type: 'learning/clearLearningState' });
    
  } catch (error) {
    console.error('Error during sign out:', error);
  }
};

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue, getState, dispatch }) => {
    try {
      // Get current state
      const { auth } = getState();
      
      // Updated: Format data correctly as expected by api.js
      const updateData = {
        username: userData.username,
        password: userData.password // Only sent if defined
      };
      
      console.log('Sending profile update with data:', {...updateData, password: userData.password ? '******' : undefined});
      const response = await authService.updateProfile(updateData);
      console.log('Profile updated successfully with response:', response);
      
      // Make sure the original user data is preserved
      const updatedUser = {
        ...auth.user,
        username: updateData.username || auth.user.username,
        ...response
      };
      
      console.log('Merged updated user data:', updatedUser);
      
      // Save any learning state with the updated user info
      dispatch(savePersistedLearningState());
      dispatch(savePersistedRecords());
      
      return updatedUser;
    } catch (error) {
      console.error('Profile update error in thunk:', error);
      return rejectWithValue(error.message || 'Profile update failed');
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const isAuthenticated = await authService.isAuthenticated();
      if (isAuthenticated) {
        const user = await authService.getCurrentUser();
        console.log('Loaded user from storage:', user);
        
        // If we have a user, also load their persisted state and records
        if (user && user.id) {
          // Load persisted learning state
          dispatch(loadPersistedLearningState(user.id));
          
          // Load persisted study records
          dispatch(loadPersistedRecords(user.id));
          
          // Fetch fresh records from the API
          setTimeout(() => {
            dispatch({ type: 'studyRecords/fetchUserRecords' });
          }, 500);
        }
        
        return { user, isAuthenticated };
      }
      return { user: null, isAuthenticated: false };
    } catch (error) {
      console.error('Load user error in thunk:', error);
      return rejectWithValue(error.message || 'Failed to load user');
    }
  }
);

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    signOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    // Add an action to manually update the user object if needed
    updateUserData: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Sign up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        // Only authenticate if token is provided
        if (action.payload && action.payload.token) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        } else {
          // Don't auto-sign in after sign up, as per your API implementation
          state.isAuthenticated = false;
        }
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Sign in
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        // Make sure we update the user data correctly
        if (action.payload) {
          state.user = action.payload;
          console.log('Updated user in state:', state.user);
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Load user
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.isAuthenticated;
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  }
});

export const { clearError, updateUserData } = authSlice.actions;

export default authSlice.reducer;