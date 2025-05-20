import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  ImageBackground,
  Pressable,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { moveToFinished, moveToCurrentFromFinished, removeFromCurrent, removeFromFinished } from '../redux/learningSlice';
import { updateDrugStatus, removeDrugFromLearning, addPronunciationScore } from '../redux/studyRecordsSlice';
import AudioPlayer from '../components/AudioPlayer';
import { getDrugById, getCategoryNameById } from '../data/dataAdapter';
import * as AudioUtils from '../utils/audioUtils';

const LearningScreen = ({ navigation, route }) => {
  const { drugId, isFinished } = route.params;
  const drug = getDrugById(drugId);
  const dispatch = useDispatch();
  
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { records } = useSelector(state => state.studyRecords);
  
  // Find the study record for this drug
  const studyRecord = records.find(record => record.drugId === drugId);
  
  const [recording, setRecording] = useState(false);
  const [recordingInstance, setRecordingInstance] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [recordingError, setRecordingError] = useState(null);
  
  // Cleanup resources when component unmounts
  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, []);
  
  // Load existing recordings if available
  useEffect(() => {
    if (studyRecord && studyRecord.recordings) {
      setRecordings(studyRecord.recordings);
    }
  }, [studyRecord]);
  
  // Cleanup function to properly release audio resources
  const cleanupResources = async () => {
    try {
      if (recordingInstance) {
        console.log('Cleaning up recording instance');
        try {
          const status = await recordingInstance.getStatusAsync();
          if (status.isRecording) {
            await recordingInstance.stopAndUnloadAsync();
          } else {
            await recordingInstance.unloadAsync();
          }
        } catch (err) {
          console.log('Error cleaning up recording:', err);
        }
        setRecordingInstance(null);
      }
      
      if (currentSound) {
        console.log('Cleaning up sound object');
        await AudioUtils.stopAudio(currentSound);
        setCurrentSound(null);
      }
      
      setPlayingId(null);
    } catch (error) {
      console.log('Cleanup error:', error);
    }
  };
  
  if (!drug) {
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
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.title}>Drug Not Found</Text>
            </View>
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={80} color="rgba(255,255,255,0.8)" />
              <Text style={styles.errorText}>
                Sorry, we couldn't find information for this drug.
              </Text>
              <TouchableOpacity 
                style={styles.returnButton}
                onPress={() => navigation.navigate('LearningList')}
              >
                <Text style={styles.returnButtonText}>Return to Learning List</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    );
  }
  
  const handleRecordPress = async () => {
    // If already recording, don't start a new recording
    if (recording) return;
    
    try {
      // Reset any previous recording errors
      setRecordingError(null);
      
      // Check for permissions first
      const hasPermission = await AudioUtils.requestRecordingPermission();
      if (!hasPermission) {
        Alert.alert('Permission Required', 'We need microphone permission to record audio');
        return;
      }
      
      console.log('Starting to record...');
      
      // Start recording - use the improved function that has iOS-specific fixes
      const newRecordingInstance = await AudioUtils.startRecording();
      
      if (newRecordingInstance) {
        setRecordingInstance(newRecordingInstance);
        setRecording(true);
        console.log('Recording started successfully');
      } else {
        console.log('Recording couldn\'t start, using mock behavior');
        // For demo purposes, simulate recording start if actual recording fails
        setRecording(true);
      }
    } catch (error) {
      console.error('Recording error:', error);
      setRecordingError(error.message || "Unknown recording error");
      // Always fall back to mock behavior for the demo
      setRecording(true);
    }
  };
  
  const handleRecordRelease = async () => {
    if (!recording) return;
    
    console.log('Stopping recording...');
    
    try {
      let recordingUri = null;
      
      if (recordingInstance) {
        console.log('Attempting to stop real recording');
        try {
          const uri = await AudioUtils.stopRecording(recordingInstance);
          if (uri) {
            // Generate a unique filename for this recording
            const timestamp = new Date().getTime();
            const filename = `recording-${timestamp}.m4a`;
            recordingUri = await AudioUtils.saveRecording(uri, filename);
            console.log('Recording saved to:', recordingUri);
          } else {
            console.log('No URI returned from stopRecording');
          }
        } catch (stopError) {
          console.error('Error stopping recording:', stopError);
          setRecordingError(stopError.message || "Error stopping recording");
        }
      } else {
        console.log('No recording instance, using mock behavior');
      }
      
      // Add recording to list - use mock if real recording failed
      const now = new Date();
      const timestamp = now.toISOString();
      // Use our custom ID function instead of UUID
      const id = AudioUtils.generateUniqueId();
      
      const newRecording = {
        id: id,
        timestamp,
        uri: recordingUri || `mock-recording-${timestamp}.m4a`, // Fallback for mock
        score: null // Will be set when evaluated
      };
      
      console.log('Adding new recording to list:', newRecording.id);
      
      setRecordings(prevRecordings => [...prevRecordings, newRecording]);
      
    } catch (error) {
      console.error('Failed in recording process:', error);
      setRecordingError(error.message || "Error in recording process");
      
      // Always add a mock recording for demo purposes
      const now = new Date();
      const timestamp = now.toISOString();
      const id = AudioUtils.generateUniqueId();
      
      const newRecording = {
        id: id,
        timestamp,
        uri: `mock-recording-${timestamp}.m4a`,
        score: null
      };
      
      console.log('Adding mock recording after error:', newRecording.id);
      
      setRecordings(prevRecordings => [...prevRecordings, newRecording]);
    } finally {
      // Reset state
      setRecordingInstance(null);
      setRecording(false);
    }
  };
  
  const handlePlayRecording = async (recordingId) => {
    const recordingToPlay = recordings.find(rec => rec.id === recordingId);
    
    if (!recordingToPlay) {
      console.log('Recording not found:', recordingId);
      return;
    }
    
    // If we're already playing this recording, stop it
    if (playingId === recordingId && currentSound) {
      console.log('Stopping current playback of:', recordingId);
      try {
        await AudioUtils.stopAudio(currentSound);
        setCurrentSound(null);
        setPlayingId(null);
      } catch (error) {
        console.error('Error stopping playback:', error);
      }
      return;
    }
    
    // Stop any current playback
    if (currentSound) {
      console.log('Stopping previous playback before starting new one');
      try {
        await AudioUtils.stopAudio(currentSound);
        setCurrentSound(null);
        setPlayingId(null);
      } catch (error) {
        console.error('Error stopping previous playback:', error);
      }
    }
    
    try {
      // Check if this is a mock recording
      if (recordingToPlay.uri.startsWith('mock-recording')) {
        console.log('Mock recording detected, simulating playback for:', recordingId);
        setPlayingId(recordingId);
        
        // Simulate playback with a timeout
        setTimeout(() => {
          console.log('Mock playback finished');
          setPlayingId(null);
        }, 3000);
        
        return;
      }
      
      console.log('Playing real recording:', recordingToPlay.uri);
      
      // Play the recording
      const sound = await AudioUtils.playAudio(recordingToPlay.uri);
      
      if (sound) {
        setCurrentSound(sound);
        setPlayingId(recordingId);
        
        // Listen for playback to finish
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            console.log('Playback finished naturally');
            setPlayingId(null);
            setCurrentSound(null);
          }
        });
      } else {
        console.log('Failed to create sound object, using mock behavior');
        // Simulate playback with a timeout
        setPlayingId(recordingId);
        setTimeout(() => {
          setPlayingId(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error playing recording:', error);
      
      // Simulate playback with a timeout
      setPlayingId(recordingId);
      setTimeout(() => {
        setPlayingId(null);
      }, 3000);
    }
  };
  
  const handleDeleteRecording = async (recordingId) => {
    // If currently playing, stop it
    if (playingId === recordingId && currentSound) {
      console.log('Stopping playback before deleting:', recordingId);
      try {
        await AudioUtils.stopAudio(currentSound);
        setCurrentSound(null);
        setPlayingId(null);
      } catch (error) {
        console.error('Error stopping playback during delete:', error);
      }
    }
    
    // Find the recording to delete
    const recordingToDelete = recordings.find(rec => rec.id === recordingId);
    
    // If it's a real recording, delete the file
    if (recordingToDelete && !recordingToDelete.uri.startsWith('mock-recording')) {
      try {
        console.log('Deleting real recording file:', recordingToDelete.uri);
        await AudioUtils.deleteRecording(recordingToDelete.uri);
      } catch (error) {
        console.error('Error deleting recording file:', error);
      }
    } else {
      console.log('No need to delete file for mock recording');
    }
    
    // Update recordings list
    console.log('Removing recording from state:', recordingId);
    setRecordings(recordings.filter(rec => rec.id !== recordingId));
  };
  
  const handleEvaluate = async (recordingId) => {
    setIsEvaluating(true);
    
    try {
      // Find the recording to evaluate
      const recordingToEvaluate = recordings.find(rec => rec.id === recordingId);
      
      if (!recordingToEvaluate) {
        Alert.alert('Error', 'Recording not found');
        return;
      }
      
      console.log('Evaluating recording:', recordingId);
      
      // Get the reference audio based on gender
      const referenceAudio = user && user.gender === 'female' ? drug.femaleAudio : drug.maleAudio;
      
      // Use the updated evaluation function that produces scores between 0-100
      const score = AudioUtils.evaluateAndScorePronunciation(recordingToEvaluate.uri, referenceAudio);
      console.log('Evaluation score:', score);
      
      // Update recording with score
      const updatedRecordings = recordings.map(rec => 
        rec.id === recordingId ? { ...rec, score } : rec
      );
      
      setRecordings(updatedRecordings);
      
      // If authenticated, update score on the server
      if (isAuthenticated && studyRecord) {
        console.log('Sending score to server for record:', studyRecord.id);
        dispatch(addPronunciationScore({ 
          recordId: studyRecord.id, 
          score 
        }));
      }
      
      // Show success message
      Alert.alert('Evaluation Complete', `Your pronunciation scored ${score} out of 100`);
    } catch (error) {
      console.error('Evaluation error:', error);
      Alert.alert('Evaluation Error', 'There was a problem evaluating your recording');
    } finally {
      setIsEvaluating(false);
    }
  };
  
  const handleFinishPress = () => {
    if (isFinished) {
      // Move back to current learning in local state
      console.log('Moving drug from finished to current learning:', drug.id);
      dispatch(moveToCurrentFromFinished(drug));
      
      // If authenticated, update on server with correct status values
      if (isAuthenticated && studyRecord) {
        console.log("Moving to learning state:", studyRecord.id);
        dispatch(updateDrugStatus({ 
          recordId: studyRecord.id, 
          updateData: {
            currentLearning: 1,  // Set to 1 to indicate it's in learning
            finishedLearning: 0, // Set to 0 to indicate it's not finished
            totalScore: studyRecord.highestScore || 0
          }
        }));
      }
    } else {
      // Move to finished in local state
      console.log('Moving drug from current learning to finished:', drug.id);
      dispatch(moveToFinished(drug));
      
      // If authenticated, update on server with correct status values
      if (isAuthenticated && studyRecord) {
        console.log("Moving to finished state:", studyRecord.id);
        dispatch(updateDrugStatus({ 
          recordId: studyRecord.id, 
          updateData: {
            currentLearning: 0,  // Set to 0 to indicate it's not in learning
            finishedLearning: 1, // Set to 1 to indicate it's finished
            totalScore: studyRecord.highestScore || 0
          }
        }));
      }
    }
    
    // Add a small delay before navigating away to allow the state update to complete
    setTimeout(() => {
      navigation.navigate('LearningList');
    }, 300);
  };
  
  const handleRemovePress = () => {
    if (isFinished) {
      console.log('Removing from finished:', drug.id);
      dispatch(removeFromFinished(drug));
    } else {
      console.log('Removing from current learning:', drug.id);
      dispatch(removeFromCurrent(drug));
    }
    
    // If authenticated, remove on server
    if (isAuthenticated && studyRecord) {
      console.log('Removing from server:', studyRecord.id);
      dispatch(removeDrugFromLearning(studyRecord.id));
    }
    
    navigation.navigate('LearningList');
  };
  
  // Format timestamp to readable format
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
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
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>{drug.name}</Text>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {/* Drug info card */}
            <View style={styles.card}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Molecular Formula</Text>
                <Text style={styles.formula}>{drug.molecularFormulas}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{drug.description}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <View style={styles.categoryContainer}>
                  {drug.categories.map((categoryId) => (
                    <View style={styles.categoryBadge} key={categoryId}>
                      <Text style={styles.categoryText}>
                        {getCategoryNameById(categoryId)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Audio players */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Pronunciations</Text>

              <AudioPlayer 
                gender="female"
                audioFile={drug.femaleAudio}
                drug={drug}
                hideStudyButton={true}
              />

              <AudioPlayer 
                gender="male"
                audioFile={drug.maleAudio}
                drug={drug}
                hideStudyButton={true}
              />
            </View>
            
            {/* Recordings */}
            {recordings.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Your Recordings</Text>
                {recordings.map(rec => (
                  <View key={rec.id} style={styles.recordingItem}>
                    <TouchableOpacity 
                      style={styles.playButton}
                      onPress={() => handlePlayRecording(rec.id)}
                    >
                      <Ionicons 
                        name={playingId === rec.id ? "pause-circle" : "play-circle"} 
                        size={24} 
                        color="#4A80F0" 
                      />
                    </TouchableOpacity>
                    
                    <Text style={styles.recordingDate}>
                      {formatTimestamp(rec.timestamp)}
                    </Text>
                    
                    {rec.score !== null ? (
                      <View style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>{rec.score}</Text>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={styles.evaluateButton}
                        onPress={() => handleEvaluate(rec.id)}
                        disabled={isEvaluating}
                      >
                        {isEvaluating ? (
                          <ActivityIndicator size="small" color="#50C878" />
                        ) : (
                          <Ionicons name="checkmark-circle" size={24} color="#50C878" />
                        )}
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteRecording(rec.id)}
                    >
                      <Ionicons name="trash" size={22} color="#FF6347" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            
            {/* Error message if recording failed */}
            {recordingError && (
              <View style={styles.errorMessageContainer}>
                <Text style={styles.errorMessageText}>
                  Using simulated recording due to device limitations.
                </Text>
              </View>
            )}
            
            {/* Record Button */}
            <Pressable 
              style={[styles.recordButton, recording && styles.recordingActive]}
              onPressIn={handleRecordPress}
              onPressOut={handleRecordRelease}
            >
              <Text style={styles.recordButtonText}>
                {recording ? "Recording..." : "Hold to Record"}
              </Text>
            </Pressable>
            
            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleFinishPress}
              >
                <Text style={styles.actionButtonText}>
                  {isFinished ? "Review" : "Finish"}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.removeButton]}
                onPress={handleRemovePress}
              >
                <Text style={styles.actionButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    backgroundColor: 'transparent',
  },
  backButton: {
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  content: {
    padding: 15,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  formula: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#444',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 10,
    borderRadius: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: '#444',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: '#4A80F0',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FF6347',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  recordingActive: {
    backgroundColor: '#FF0000',
    transform: [{ scale: 1.1 }],
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#4A80F0',
    borderRadius: 10,
    paddingVertical: 14,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#FF6347',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  playButton: {
    marginRight: 10,
  },
  recordingDate: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  scoreContainer: {
    backgroundColor: '#4A80F0',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  scoreText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  evaluateButton: {
    marginRight: 10,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  errorMessageContainer: {
    backgroundColor: 'rgba(255, 99, 71, 0.8)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorMessageText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  returnButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#fff',
  },
  returnButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LearningScreen;