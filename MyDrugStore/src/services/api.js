import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for the API - replace with your actual server URL
const API_URL = 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token in headers
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication services
export const authService = {
  signUp: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Sign up failed' };
    }
  },

  signIn: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Store the token in AsyncStorage
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Sign in failed' };
    }
  },

  signOut: async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },

  getCurrentUser: async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      
      // Update stored user data
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Update profile failed' };
    }
  },

  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  }
};

// User study records services
export const studyRecordsService = {
  // Add a drug to learning list
  addToLearning: async (drugId) => {
    try {
      const response = await api.post('/study-records', { drugId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add drug to learning list' };
    }
  },

  // Update a drug's learning status
  updateLearningStatus: async (recordId, status) => {
    try {
      const response = await api.put(`/study-records/${recordId}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update learning status' };
    }
  },

  // Add a pronunciation score
  addPronunciationScore: async (recordId, score) => {
    try {
      const response = await api.post(`/study-records/${recordId}/scores`, { score });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add pronunciation score' };
    }
  },

  // Get user's learning records
  getUserRecords: async () => {
    try {
      const response = await api.get('/study-records');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get learning records' };
    }
  },

  // Remove a drug from learning list
  removeFromLearning: async (recordId) => {
    try {
      const response = await api.delete(`/study-records/${recordId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to remove drug from learning list' };
    }
  }
};

// Community services
export const communityService = {
  // Get user rankings
  getRankings: async () => {
    try {
      const response = await api.get('/users/rankings');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get rankings' };
    }
  }
};

export default api;