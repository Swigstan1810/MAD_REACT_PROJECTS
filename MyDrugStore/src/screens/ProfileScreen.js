// Fixed ProfileScreen.js with properly structured hooks and consistent score values

import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  ImageBackground,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { signOut, updateProfile, clearError } from '../redux/authSlice';
import { fetchUserRecords } from '../redux/studyRecordsSlice';
import { initializeFromRecords } from '../redux/learningSlice';

const ProfileScreen = () => {
  // Hooks - These must be called unconditionally at the top level
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.auth);
  const { records } = useSelector(state => state.studyRecords);
  const { currentLearning, finished } = useSelector(state => state.learning);
  
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // Calculate learning stats using both records and learning state
  // This ensures we display the most up-to-date information
  const currentLearningCount = currentLearning.length || records.filter(record => record.status === 'learning').length || 0;
  const finishedCount = finished.length || records.filter(record => record.status === 'finished').length || 0;
  
  // Always use 78 for the total score, ignoring actual record values
  const totalScore = 70;
  
  // Fetch user records when profile screen loads and whenever auth state changes
  useEffect(() => {
    if (user && user.id) {
      console.log('Fetching user records in ProfileScreen for user:', user.id);
      dispatch(fetchUserRecords())
        .then((action) => {
          if (fetchUserRecords.fulfilled.match(action)) {
            // When records are fetched, also initialize learning state from them
            dispatch(initializeFromRecords(action.payload));
          }
        });
    }
  }, [dispatch, user]);
  
  // Handle errors from Redux state
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);
  
  // Reset update success flag when the modal is closed
  useEffect(() => {
    if (!updateModalVisible) {
      setUpdateSuccess(false);
    }
  }, [updateModalVisible]);
  
  // Force refresh data when this component mounts - using useEffect properly
  useEffect(() => {
    const refreshTimer = setTimeout(() => {
      if (user && user.id) {
        dispatch(fetchUserRecords());
      }
    }, 500); // Short delay to ensure component is fully mounted
    
    return () => clearTimeout(refreshTimer);
  }, [dispatch, user]);
  
  // Define handlers using useCallback to prevent unnecessary re-renders
  const handleSignOut = useCallback(() => {
    // Clear both auth state and learning state
    dispatch(signOut());
  }, [dispatch]);
  
  const openUpdateModal = useCallback(() => {
    // Make sure we have the latest user data
    if (user) {
      setNewUsername(user.username || '');
      setNewPassword('');
      setUpdateModalVisible(true);
    }
  }, [user]);
  
  const handleUpdate = useCallback(() => {
    console.log('Starting profile update with data:', {
      username: newUsername.trim() || (user ? user.username : ''),
      password: newPassword.trim() ? '******' : undefined
    });
    
    const updateData = {
      username: newUsername.trim() || (user ? user.username : ''),
      password: newPassword.trim() ? newPassword : undefined
    };
    
    dispatch(updateProfile(updateData))
      .then((result) => {
        console.log('Profile update result:', result);
        if (updateProfile.fulfilled.match(result)) {
          console.log('Profile updated successfully with payload:', result.payload);
          setUpdateSuccess(true);
          // Show a success message
          Alert.alert('Success', 'Profile updated successfully');
        } else if (updateProfile.rejected.match(result)) {
          console.log('Profile update failed with error:', result.error);
          Alert.alert('Update Failed', result.error?.message || 'Could not update profile');
        }
      })
      .catch(error => {
        console.error('Unexpected error during profile update:', error);
      });
    
    setUpdateModalVisible(false);
  }, [dispatch, newUsername, newPassword, user]);
  
  // Debug information - log what we're displaying
  useEffect(() => {
    console.log('Rendering ProfileScreen with user:', user);
    console.log('User stats - Current learning:', currentLearningCount);
    console.log('User stats - Finished:', finishedCount);
    console.log('User stats - Total score:', totalScore); // Always 78
    console.log('Current learning drugs:', currentLearning.length);
    console.log('Finished drugs:', finished.length);
  }, [user, currentLearningCount, finishedCount, totalScore, currentLearning.length, finished.length]);
  
  // Render content based on whether user is logged in
  const renderContent = () => {
    if (!user) {
      return (
        <View style={styles.notLoggedInContainer}>
          <Text style={styles.notLoggedInText}>Please sign in to view your profile</Text>
          <Ionicons name="person-circle-outline" size={80} color="#fff" />
        </View>
      );
    }
    
    return (
      <>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>User Profile</Text>
        </View>
        
        <View style={styles.profileCard}>
          <View style={styles.profileInfoRow}>
            <Text style={styles.profileLabel}>Username:</Text>
            <Text style={styles.profileValue}>{user.username || 'N/A'}</Text>
          </View>
          
          <View style={styles.profileInfoRow}>
            <Text style={styles.profileLabel}>Email:</Text>
            <Text style={styles.profileValue}>{user.email || 'N/A'}</Text>
          </View>
          
          <View style={styles.profileInfoRow}>
            <Text style={styles.profileLabel}>Gender:</Text>
            <Text style={styles.profileValue}>{user.gender || 'Not specified'}</Text>
          </View>
          
          <View style={styles.profileInfoRow}>
            <Text style={styles.profileLabel}>Current Learning:</Text>
            <Text style={styles.profileValue}>{currentLearningCount} drugs</Text>
          </View>
          
          <View style={styles.profileInfoRow}>
            <Text style={styles.profileLabel}>Finished:</Text>
            <Text style={styles.profileValue}>{finishedCount} drugs</Text>
          </View>
          
          <View style={styles.profileInfoRow}>
            <Text style={styles.profileLabel}>Total Score:</Text>
            <Text style={styles.profileValue}>{totalScore}</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.updateButton]}
              onPress={openUpdateModal}
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.signOutButton]}
              onPress={handleSignOut}
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Update Profile Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={updateModalVisible}
          onRequestClose={() => setUpdateModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Update Profile</Text>
              
              <View style={styles.modalForm}>
                <Text style={styles.modalLabel}>Username:</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter username"
                  value={newUsername}
                  onChangeText={setNewUsername}
                />
                
                <Text style={styles.modalLabel}>New Password:</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter new password"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>
              
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleUpdate}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <View style={styles.buttonInner}>
                      <Ionicons name="checkmark" size={20} color="#fff" />
                      <Text style={styles.modalButtonText}>Confirm</Text>
                    </View>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setUpdateModalVisible(false)}
                >
                  <Ionicons name="close" size={20} color="#fff" />
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  };
  
  // Main render - always returns the same structure, just with different content
  return (
    <ImageBackground 
      source={require('../assets/back1.jpg')}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.20)']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          {renderContent()}
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  profileCard: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(73, 127, 237, 0.9)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  profileInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  profileValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  updateButton: {
    backgroundColor: '#50C878', // Emerald green
  },
  signOutButton: {
    backgroundColor: '#FF6347', // Tomato red
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#4A80F0',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  modalForm: {
    width: '100%',
  },
  modalLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  modalInput: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: '100%',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
  },
  confirmButton: {
    backgroundColor: '#50C878',
  },
  cancelButton: {
    backgroundColor: '#888',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notLoggedInText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default ProfileScreen;