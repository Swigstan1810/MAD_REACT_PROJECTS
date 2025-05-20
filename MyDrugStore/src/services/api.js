import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// IMPORTANT: Configure the correct API URL based on your environment
// Using the IP from your Expo logs
const API_URL = 'http://192.168.0.104:3000';

console.log('API connecting to:', API_URL);

// Create axios instance with detailed settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000, // 15 second timeout
});

// Add request interceptor to include JWT token in headers
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      console.log('📦 Request data:', config.data ? JSON.stringify(config.data) : 'No data');
      
      return config;
    } catch (error) {
      console.error('❌ Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    console.error('❌ Request setup error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response Success: ${response.status} for ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('📝 API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('📝 API No Response Error - Request made but no response received');
      console.error('💡 Connection troubleshooting:');
      console.log(`1. Check if server is running on ${API_URL}`);
      console.log(`2. Try opening ${API_URL} in a browser on your iOS device`);
      console.log('3. Ensure your server has CORS enabled');
      console.log('4. Verify both devices are on the same network');
      
      // Additional error details for debugging
      try {
        console.log('📄 Detailed request info:', {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        });
      } catch (e) {
        console.log('Could not log detailed request info');
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('📝 API Request Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Authentication services - Updated based on schema
export const authService = {
  // Modified to match CreateUserDto schema and actual API usage
  signUp: async (userData) => {
    try {
      console.log('📝 Signing up user with data:', {...userData, password: '******'});
      
      // Ensure we're sending all fields the server expects
      // Changed to use username consistently instead of name
      const sanitizedData = {
        username: userData.username, // Required in schema
        email: userData.email,       // Required in schema
        password: userData.password, // Required in schema
        gender: userData.gender      // Required in schema
      };
      
      const response = await api.post('/users', sanitizedData);
      
      console.log('✅ Signup successful:', response.data);
      
      // Store token if provided
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Signup error:', error);
      throw error.response?.data || { message: 'Sign up failed' };
    }
  },

  // Modified to match LoginDto schema
  signIn: async (credentials) => {
    try {
      console.log('📝 Signing in with email:', credentials.email);
      
      // Ensure we're sending fields based on LoginDto
      const loginData = {
        email: credentials.email,       // Required in schema
        password: credentials.password  // Required in schema
      };
      
      const response = await api.post('/auth/login', loginData);
      
      console.log('✅ Login successful');
      
      // Store the token in AsyncStorage
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Sign in error:', error);
      throw error.response?.data || { message: 'Sign in failed' };
    }
  },

  signOut: async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      console.log('✅ Signed out successfully');
    } catch (error) {
      console.error('❌ Error signing out:', error);
    }
  },

  getCurrentUser: async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('❌ Error getting current user:', error);
      return null;
    }
  },

  // Modified to use username instead of name
  // updateProfile method in api.js - Updated version

// Modified to use username instead of name
  updateProfile: async (userData) => {
    try {
      console.log('📝 Updating user profile');
      
      // Updated to use username instead of name
      const updateData = {
        username: userData.username,
        password: userData.password
      };
      
      console.log('Sending update data:', {...updateData, password: updateData.password ? '******' : undefined});
      
      const response = await api.patch('/users/update', updateData);
      
      console.log('✅ Profile updated successfully with response:', response.data);
      
      // Update stored user data in localStorage
      if (response.data) {
        // Get the current user data
        const currentUserStr = await AsyncStorage.getItem('user');
        let currentUser = currentUserStr ? JSON.parse(currentUserStr) : {};
        
        // Update with the new data
        const updatedUser = {
          ...currentUser,
          ...response.data
        };
        
        console.log('Saving updated user to local storage:', updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Update profile error:', error);
      throw error.response?.data || { message: 'Update profile failed' };
    }
  },

  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  }
};

// User study records services - Updated based on schema
export const studyRecordsService = {
  // Add a drug to learning list
  addToLearning: async (drugId) => {
    try {
      console.log('📝 Adding drug to learning list:', drugId);
      
      // Based on server documentation, we're just sending the drugId
      const response = await api.post('/study-record', { drugId });
      
      console.log('✅ Drug added to learning list');
      
      return response.data;
    } catch (error) {
      console.error('❌ Add to learning error:', error);
      throw error.response?.data || { message: 'Failed to add drug to learning list' };
    }
  },

  // Update a drug's learning status based on server documentation
  updateLearningStatus: async (recordId, updateData) => {
    try {
      console.log(`📝 Updating study record ${recordId}`);
      
      // Format based on server documentation
      const studyRecordUpdate = {
        recordId, // Add the recordId to the request payload
        currentLearning: updateData.currentLearning, 
        finishedLearning: updateData.finishedLearning, 
        totalScore: updateData.totalScore 
      };
      
      const response = await api.patch(`/study-record/${recordId}`, studyRecordUpdate);
      
      console.log('✅ Study record updated');
      
      return response.data;
    } catch (error) {
      console.error('❌ Update study record error:', error);
      throw error.response?.data || { message: 'Failed to update study record' };
    }
  },

  // Add a pronunciation score
  addPronunciationScore: async (recordId, score) => {
    try {
      console.log(`📝 Adding pronunciation score ${score} for record ${recordId}`);
      
      const response = await api.post(`/study-record/score`, { 
        recordId, 
        score 
      });
      
      console.log('✅ Pronunciation score added');
      
      return response.data;
    } catch (error) {
      console.error('❌ Add score error:', error);
      throw error.response?.data || { message: 'Failed to add pronunciation score' };
    }
  },

  // Get user's learning records
  getUserRecords: async () => {
    try {
      console.log('📝 Getting user learning records');
      
      const response = await api.get('/study-record');
      
      console.log(`✅ Retrieved ${response.data.length} learning records`);
      
      return response.data;
    } catch (error) {
      console.error('❌ Get records error:', error);
      throw error.response?.data || { message: 'Failed to get learning records' };
    }
  },

  // Remove a drug from learning list
  removeFromLearning: async (recordId) => {
    try {
      console.log('📝 Removing drug from learning list:', recordId);
      
      const response = await api.delete(`/study-record/${recordId}`);
      
      console.log('✅ Drug removed from learning list');
      
      return response.data;
    } catch (error) {
      console.error('❌ Remove from learning error:', error);
      throw error.response?.data || { message: 'Failed to remove drug from learning list' };
    }
  }
};

// Helper function to get mock rankings
function getMockRankings() {
  return [
    { id: 'user1', username: 'John Doe', gender: 'male', totalScore: 850, currentLearningCount: 5, finishedCount: 12 },
    { id: 'defaultUser', username: 'Janak', gender: 'male', totalScore: 720, currentLearningCount: 4, finishedCount: 8 },
    { id: 'user2', username: 'Jane Smith', gender: 'female', totalScore: 680, currentLearningCount: 3, finishedCount: 10 },
    { id: 'user3', username: 'Alex Johnson', gender: 'male', totalScore: 590, currentLearningCount: 6, finishedCount: 5 },
    { id: 'user4', username: 'Sarah Wilson', gender: 'female', totalScore: 520, currentLearningCount: 2, finishedCount: 7 },
    { id: 'user5', username: 'Michael Brown', gender: 'male', totalScore: 480, currentLearningCount: 3, finishedCount: 5 },
  ];
}

export const communityService = {
  getRankings: async () => {
    try {
      console.log('📝 Getting study records to calculate rankings');
      const isAuthenticated = await authService.isAuthenticated();
      if (!isAuthenticated) {
        console.log('User not authenticated, returning mock rankings');
        return getMockRankings();
      }
      const response = await api.get('/study-record');
      console.log(`✅ Retrieved ${response.data?.length || 0} study records`);
      if (!response.data || response.data.length === 0) {
        console.log('No study records found, returning mock rankings');
        return getMockRankings();
      }
      const userGroups = {};
      response.data.forEach(record => {
        const userId = record.userId || 'defaultUser';
        if (!userGroups[userId]) {
          userGroups[userId] = {
            id: userId,
            username: record.userName || 'Unknown User', // Changed from name to username
            gender: record.userGender || 'male',
            totalScore: 0,
            currentLearningCount: 0,
            finishedCount: 0
          };
        }
        userGroups[userId].totalScore += record.highestScore || 0;
        if (record.status === 'learning') {
          userGroups[userId].currentLearningCount++;
        } else if (record.status === 'finished') {
          userGroups[userId].finishedCount++;
        }
      });
      if (Object.keys(userGroups).length === 0) {
        console.log('No user groups found, returning mock rankings');
        return getMockRankings();
      }
      const rankings = Object.values(userGroups).sort((a, b) => b.totalScore - a.totalScore);
      console.log(`✅ Calculated rankings for ${rankings.length} users`);
      return rankings;
    } catch (error) {
      console.error('❌ Get rankings error:', error);
      console.log('📝 Generating mock rankings data for display');
      return getMockRankings();
    }
  }
};

export default api;