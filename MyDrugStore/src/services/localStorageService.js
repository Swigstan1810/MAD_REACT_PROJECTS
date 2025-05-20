import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Service to handle persistence of app state in AsyncStorage
 */
const localStorageService = {
  // Learning state persistence
  saveLearningState: async (userId, learningState) => {
    try {
      if (userId) {
        const key = `learningState_${userId}`;
        await AsyncStorage.setItem(key, JSON.stringify(learningState));
        console.log('Saved learning state to local storage for user:', userId);
      }
    } catch (error) {
      console.error('Error saving learning state:', error);
    }
  },

  loadLearningState: async (userId) => {
    try {
      if (userId) {
        const key = `learningState_${userId}`;
        const savedState = await AsyncStorage.getItem(key);
        if (savedState) {
          console.log('Loaded learning state from local storage for user:', userId);
          return JSON.parse(savedState);
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading learning state:', error);
      return null;
    }
  },

  // User study records persistence
  saveUserRecords: async (userId, records) => {
    try {
      if (userId) {
        const key = `studyRecords_${userId}`;
        await AsyncStorage.setItem(key, JSON.stringify(records));
        console.log('Saved study records to local storage for user:', userId);
      }
    } catch (error) {
      console.error('Error saving study records:', error);
    }
  },

  loadUserRecords: async (userId) => {
    try {
      if (userId) {
        const key = `studyRecords_${userId}`;
        const savedRecords = await AsyncStorage.getItem(key);
        if (savedRecords) {
          console.log('Loaded study records from local storage for user:', userId);
          return JSON.parse(savedRecords);
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading study records:', error);
      return null;
    }
  },

  // Clear storage for a specific user when they log out
  clearUserData: async (userId) => {
    try {
      if (userId) {
        // Remove learning state
        const learningStateKey = `learningState_${userId}`;
        await AsyncStorage.removeItem(learningStateKey);
        
        // Remove study records
        const studyRecordsKey = `studyRecords_${userId}`;
        await AsyncStorage.removeItem(studyRecordsKey);
        
        console.log('Cleared local storage data for user:', userId);
      }
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }
};

export default localStorageService;