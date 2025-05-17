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
});