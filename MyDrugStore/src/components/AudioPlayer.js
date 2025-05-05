import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { addToCurrent } from '../redux/learningSlice';
import { Audio } from 'expo-av';
import { soundsMap } from '../utils/audioMapper';

const AudioPlayer = ({ gender, audioFile, onStudyPress, drug, hideStudyButton = false }) => {
  const [speed, setSpeed] = useState(1.0);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  
  const dispatch = useDispatch();
  const currentLearning = useSelector(state => state.learning.currentLearning);
  const finished = useSelector(state => state.learning.finished);
  
  const isDrugInLearning = drug && 
    (currentLearning.some(item => item.id === drug.id) || 
     finished.some(item => item.id === drug.id));
  
  const speedOptions = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
  
  // Cleanup sound when component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);
  
  const handlePlayPress = async () => {
    // If sound is already playing, stop it
    if (isPlaying && sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      return;
    }
    
    try {
      // Unload previous sound if it exists
      if (sound) {
        await sound.unloadAsync();
      }
      
      console.log(`Playing audio: ${audioFile} at speed: ${speed}x`);
      
      // Get the audio source from our static mapping
      // Note: audioFile is the full filename like "Ibuprofen - female.wav"
      const audioSource = soundsMap[audioFile];
      
      if (!audioSource) {
        console.log(`Audio file not found in mapping: ${audioFile}`);
        // Try to recover by checking if the mapping is slightly different
        
        // This is a fallback mechanism to handle possible inconsistencies in file naming
        const fallbackFile = Object.keys(soundsMap).find(key => 
          key.toLowerCase().includes(audioFile.toLowerCase().split(' - ')[0])
          && key.toLowerCase().includes(gender.toLowerCase())
        );
        
        if (fallbackFile) {
          console.log(`Found fallback audio file: ${fallbackFile}`);
          const { sound: newSound } = await Audio.Sound.createAsync(
            soundsMap[fallbackFile],
            { 
              shouldPlay: true,
              rate: speed,
              volume: 1.0 
            }
          );
          
          setSound(newSound);
          setIsPlaying(true);
          
          // Listen for playback status updates
          newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          });
          return;
        }
        
        throw new Error('Audio file not found');
      }
      
      // Create and play the sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        audioSource,
        { 
          shouldPlay: true,
          rate: speed,
          volume: 1.0 
        }
      );
      
      setSound(newSound);
      setIsPlaying(true);
      
      // Listen for playback status updates
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.log(`Error playing ${audioFile}: ${error}`);
      Alert.alert(
        'Playback Error', 
        `Unable to play "${audioFile}". Please check that the file exists.`,
        [{ text: 'OK' }]
      );
      
      // Fall back to mock behavior for milestone 2 - this ensures UI behaves correctly
      // even if there are issues with the audio files
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000); // Simulate 3 seconds of audio playback
    }
  };
  
  const toggleSpeedOptions = () => {
    setShowSpeedOptions(!showSpeedOptions);
  };
  
  const selectSpeed = async (newSpeed) => {
    setSpeed(newSpeed);
    setShowSpeedOptions(false);
    
    // If sound is already loaded, update the playback rate
    if (sound) {
      try {
        await sound.setRateAsync(newSpeed, true);
      } catch (error) {
        console.log(`Error setting playback rate: ${error}`);
      }
    }
  };
  
  const handleStudyButtonPress = () => {
    if (drug) {
      dispatch(addToCurrent(drug));
    }
    if (onStudyPress) {
      onStudyPress();
    }
  };
  
  const gradientColors = gender === 'female' 
    ? ['#FF6CAB', '#7366FF'] 
    : ['#4776E6', '#8E54E9'];
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.playerRow}
      >
        <TouchableOpacity style={styles.iconButton} onPress={handlePlayPress}>
          <Ionicons 
            name={isPlaying ? "pause-circle" : "play-circle"} 
            size={44} 
            color="#fff" 
          />
        </TouchableOpacity>
        
        <View style={styles.genderContainer}>
          <Ionicons 
            name={gender === 'female' ? 'woman' : 'man'} 
            size={24} 
            color="#fff"
          />
          <Text style={styles.genderLabel}>
            {gender === 'female' ? 'Female' : 'Male'}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.speedButton} onPress={toggleSpeedOptions}>
          <Text style={styles.speedText}>{speed}x</Text>
          <Ionicons name="chevron-down" size={16} color="#fff" />
        </TouchableOpacity>
        
        {!hideStudyButton && !isDrugInLearning && (
          <TouchableOpacity style={styles.studyButton} onPress={handleStudyButtonPress}>
            <Text style={styles.studyButtonText}>
              <Ionicons name="bookmark" size={14} color="#fff" style={styles.studyIcon} /> Study
            </Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
      
      <Modal
        transparent={true}
        visible={showSpeedOptions}
        onRequestClose={() => setShowSpeedOptions(false)}
        animationType="fade"
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowSpeedOptions(false)}
        >
          <View style={styles.speedOptionsContainer}>
            <View style={styles.speedOptions}>
              <Text style={styles.speedOptionsTitle}>Playback Speed</Text>
              <View style={styles.optionsGrid}>
                {speedOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.speedOption,
                      speed === option && styles.selectedSpeed,
                    ]}
                    onPress={() => selectSpeed(option)}
                  >
                    <Text
                      style={[
                        styles.speedOptionText,
                        speed === option && styles.selectedSpeedText,
                      ]}
                    >
                      {option}x
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

// Styles remain the same as in your original AudioPlayer.js
const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  iconButton: {
    padding: 5,
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    paddingHorizontal: 8,
  },
  genderLabel: {
    fontSize: 16,
    marginLeft: 6,
    color: '#fff',
    fontWeight: '500',
  },
  speedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 10,
  },
  speedText: {
    fontSize: 14,
    marginRight: 4,
    color: '#fff',
    fontWeight: '500',
  },
  studyButton: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  studyButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  studyIcon: {
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  speedOptionsContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  speedOptions: {
    width: '100%',
  },
  speedOptionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  speedOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    minWidth: 60,
    alignItems: 'center',
  },
  selectedSpeed: {
    backgroundColor: '#6c5ce7',
  },
  speedOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedSpeedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AudioPlayer;