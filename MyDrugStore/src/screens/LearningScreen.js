import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  ImageBackground,
  Dimensions,
  Pressable,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { 
  moveToFinished, 
  moveToCurrentFromFinished, 
  removeFromCurrent, 
  removeFromFinished 
} from '../redux/learningSlice';
import AudioPlayer from '../components/AudioPlayer';
import { getDrugById, getCategoryNameById } from '../data/dataAdapter';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

const LearningScreen = ({ navigation, route }) => {
  const { drugId, isFinished } = route.params;
  const drug = getDrugById(drugId);
  const dispatch = useDispatch();
  
  const [recording, setRecording] = useState(false);
  const [recordingInstance, setRecordingInstance] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [playbackSound, setPlaybackSound] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [isAudioMode, setIsAudioMode] = useState(false);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, []);
  
  // Cleanup function to properly release audio resources
  const cleanupResources = async () => {
    try {
      if (recordingInstance) {
        await recordingInstance.stopAndUnloadAsync();
      }
      
      if (playbackSound) {
        await playbackSound.stopAsync();
        await playbackSound.unloadAsync();
      }
      
      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
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
  
  // Request permissions for audio recording
  const requestRecordingPermission = async () => {
    try {
      console.log('Requesting recording permission...');
      const { status, canAskAgain } = await Audio.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Permission to access microphone is required for recording.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      console.log('Recording permission granted');
      return true;
    } catch (error) {
      console.error('Failed to get recording permission:', error);
      return false;
    }
  };
  
  const handleFinishPress = () => {
    if (isFinished) {
      // Move back to current learning
      dispatch(moveToCurrentFromFinished(drug));
    } else {
      // Move to finished
      dispatch(moveToFinished(drug));
    }
    navigation.navigate('LearningList');
  };
  
  const handleRemovePress = () => {
    if (isFinished) {
      dispatch(removeFromFinished(drug));
    } else {
      dispatch(removeFromCurrent(drug));
    }
    navigation.navigate('LearningList');
  };
  
  const prepareAudioMode = async () => {
    if (isAudioMode) return true;
    
    try {
      console.log('Setting audio mode...');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      
      setIsAudioMode(true);
      return true;
    } catch (error) {
      console.error('Failed to set audio mode:', error);
      return false;
    }
  };
  
  const handleRecordPress = async () => {
    // If already recording, don't start a new recording
    if (recording) return;
    
    try {
      // Check for permissions first
      const hasPermission = await requestRecordingPermission();
      if (!hasPermission) return;
      
      // Ensure audio mode is set properly
      const audioModeSet = await prepareAudioMode();
      if (!audioModeSet) {
        Alert.alert('Error', 'Failed to prepare audio for recording');
        return;
      }
      
      // Make sure previous recording is cleaned up
      if (recordingInstance) {
        await recordingInstance.stopAndUnloadAsync();
        setRecordingInstance(null);
      }
      
      console.log('Creating new recording...');
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();
      
      setRecordingInstance(newRecording);
      setRecording(true);
      console.log('Recording started successfully');
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      
      if (error.message.includes('Only one Recording')) {
        // Try to recover by resetting audio mode
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
          });
          
          setTimeout(async () => {
            await Audio.setAudioModeAsync({
              allowsRecordingIOS: true,
              playsInSilentModeIOS: true,
              staysActiveInBackground: false,
              shouldDuckAndroid: true,
            });
          }, 300);
        } catch (resetError) {
          console.error('Failed to reset audio mode:', resetError);
        }
      }
      
      // For demo purposes, simulate recording start
      Alert.alert('Recording Error', 'Could not start recording, but will simulate for demo purposes.');
      setRecording(true);
    }
  };
  
  const handleRecordRelease = async () => {
    if (!recording) return;
    
    try {
      let recordingUri = null;
      
      if (recordingInstance) {
        console.log('Stopping recording...');
        await recordingInstance.stopAndUnloadAsync();
        recordingUri = recordingInstance.getURI();
        console.log(`Recording saved to: ${recordingUri}`);
      }
      
      // Add recording to list
      const now = new Date();
      const timestamp = now.toISOString();
      const newRecording = {
        id: timestamp,
        timestamp,
        uri: recordingUri || `mock-recording-${timestamp}.m4a`, // Fallback for mock
        score: null // Will be set when evaluated
      };
      
      setRecordings(prevRecordings => [...prevRecordings, newRecording]);
      
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to save recording, but will create mock recording for demo');
      
      // Add a mock recording for demo purposes
      const now = new Date();
      const timestamp = now.toISOString();
      const newRecording = {
        id: timestamp,
        timestamp,
        uri: `mock-recording-${timestamp}.m4a`,
        score: null
      };
      
      setRecordings(prevRecordings => [...prevRecordings, newRecording]);
    } finally {
      // Reset state
      setRecordingInstance(null);
      setRecording(false);
      
      // Reset audio mode
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
        });
        setIsAudioMode(false);
      } catch (error) {
        console.error('Failed to reset audio mode:', error);
      }
    }
  };
  
  const handlePlayRecording = async (recordingId) => {
    const recordingToPlay = recordings.find(rec => rec.id === recordingId);
    
    if (!recordingToPlay) return;
    
    // If we're already playing this recording, stop it
    if (playingId === recordingId && playbackSound) {
      try {
        await playbackSound.stopAsync();
        await playbackSound.unloadAsync();
        setPlaybackSound(null);
        setPlayingId(null);
      } catch (error) {
        console.error('Error stopping playback:', error);
      }
      return;
    }
    
    // Stop any current playback
    if (playbackSound) {
      try {
        await playbackSound.stopAsync();
        await playbackSound.unloadAsync();
        setPlaybackSound(null);
        setPlayingId(null);
      } catch (error) {
        console.error('Error stopping previous playback:', error);
      }
    }
    
    try {
      // Make sure we're not in recording mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      
      console.log(`Playing recording from: ${recordingToPlay.uri}`);
      
      // Check if this is a mock recording
      if (recordingToPlay.uri.startsWith('mock-recording')) {
        console.log('Mock recording detected, simulating playback');
        setPlayingId(recordingId);
        
        // Simulate playback with a timeout
        setTimeout(() => {
          setPlayingId(null);
        }, 3000);
        
        return;
      }
      
      // Create and play the sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingToPlay.uri },
        { shouldPlay: true }
      );
      
      setPlaybackSound(sound);
      setPlayingId(recordingId);
      
      // Listen for playback status updates
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingId(null);
        }
      });
      
    } catch (error) {
      console.error('Error playing recording:', error);
      Alert.alert('Playback Error', 'Could not play the recording, but will simulate for demo purposes.');
      
      // Simulate playback with a timeout
      setPlayingId(recordingId);
      setTimeout(() => {
        setPlayingId(null);
      }, 3000);
    }
  };
  
  const handleDeleteRecording = (recordingId) => {
    // If currently playing, stop it
    if (playingId === recordingId && playbackSound) {
      try {
        playbackSound.stopAsync();
        playbackSound.unloadAsync();
        setPlaybackSound(null);
        setPlayingId(null);
      } catch (error) {
        console.error('Error stopping playback during delete:', error);
      }
    }
    
    setRecordings(recordings.filter(rec => rec.id !== recordingId));
  };
  
  const handleEvaluate = (recordingId) => {
    // Simulate evaluation - generate random score
    const score = Math.floor(Math.random() * 101);
    
    setRecordings(recordings.map(rec => 
      rec.id === recordingId ? { ...rec, score } : rec
    ));
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
                      <Text style={styles.scoreText}>({rec.score})</Text>
                    ) : (
                      <TouchableOpacity 
                        style={styles.evaluateButton}
                        onPress={() => handleEvaluate(rec.id)}
                      >
                        <Ionicons name="checkmark-circle" size={24} color="#50C878" />
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

// Styles remain the same as in your original LearningScreen.js
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
  scoreText: {
    fontSize: 16,
    color: '#4A80F0',
    fontWeight: 'bold',
    marginRight: 10,
  },
  evaluateButton: {
    marginRight: 10,
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