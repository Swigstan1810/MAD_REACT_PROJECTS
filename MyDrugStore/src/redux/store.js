import { configureStore } from '@reduxjs/toolkit';
import learningReducer from './learningSlice';
import authReducer from './authSlice';
import studyRecordsReducer from './studyRecordsSlice';

export const store = configureStore({
  reducer: {
    learning: learningReducer,
    auth: authReducer,
    studyRecords: studyRecordsReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types to avoid serialization errors with complex data types
        ignoredActions: ['studyRecords/updateDrugStatus/fulfilled'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});