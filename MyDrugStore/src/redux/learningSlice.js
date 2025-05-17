import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLearning: [],
  finished: []
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
    }
  },
});

export const { 
  addToCurrent, 
  moveToFinished, 
  moveToCurrentFromFinished, 
  removeFromCurrent,
  removeFromFinished 
} = learningSlice.actions;

export default learningSlice.reducer;console.log('addToCurrent action dispatched');
console.log('moveToFinished action dispatched');
console.log('moveToCurrentFromFinished action dispatched');
console.log('removeFromCurrent action dispatched');
console.log('removeFromFinished action dispatched');