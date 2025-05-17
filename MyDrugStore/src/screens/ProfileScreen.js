import React, { useState, useEffect } from 'react';
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

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.auth);
  const { records } = useSelector(state => state.studyRecords);
  
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Calculate learning stats
  const currentLearningCount = records.filter(record => record.status === 'learning').length;
  const finishedCount = records.filter(record => record.status === 'finished').length;
  const totalScore = records.reduce((sum, record) => sum + (record.highestScore || 0), 0);
  
  useEffect(() => {
    dispatch(fetchUserRecords());
  }, [dispatch]);
  
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);
  
  const handleSignOut = () => {
    dispatch(signOut());
  };
  
  const openUpdateModal = () => {
    setNewName(user?.name || '');
    setNewPassword('');
    setUpdateModalVisible(true);
  };
  
  const handleUpdate = () => {
    const updateData = {
      name: newName.trim() || user?.name,
      password: newPassword.trim() ? newPassword : undefined
    };
    
    dispatch(updateProfile(updateData));
    setUpdateModalVisible(false);
  };
  
  if (!user) {
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
            <View style={styles.notLoggedInContainer}>
              <Text style={styles.notLoggedInText}>Please sign in to view your profile</Text>
              <Ionicons name="person-circle-outline" size={80} color="#fff" />
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    );
  }
  
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
          <View style={styles.header}>
            <Text style={styles.headerTitle}>User Profile</Text>
          </View>
          
          <View style={styles.profileCard}>
            <View style={styles.profileInfoRow}>
              <Text style={styles.profileLabel}>User Name:</Text>
              <Text style={styles.profileValue}>{user.name}</Text>
            </View>
            
            <View style={styles.profileInfoRow}>
              <Text style={styles.profileLabel}>Email:</Text>
              <Text style={styles.profileValue}>{user.email}</Text>
            </View>
            
            <View style={styles.profileInfoRow}>
              <Text style={styles.profileLabel}>Gender:</Text>
              <Text style={styles.profileValue}>{user.gender}</Text>
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
                  <Text style={styles.modalLabel}>New User Name:</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter new name"
                    value={newName}
                    onChangeText={setNewName}
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
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

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