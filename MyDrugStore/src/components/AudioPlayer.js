import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { addToCurrent } from '../redux/learningSlice';

const AudioPlayer = ({ gender, audioFile, onStudyPress, drug, hideStudyButton = false }) => {
  const [speed, setSpeed] = useState(1.0);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const dispatch = useDispatch();
  const currentLearning = useSelector(state => state.learning.currentLearning);
  const finished = useSelector(state => state.learning.finished);
  
  const isDrugInLearning = drug && 
    (currentLearning.some(item => item.id === drug.id) || 
     finished.some(item => item.id === drug.id));
  
  const speedOptions = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
  
  const handlePlayPress = () => {
    console.log(`Playing ${audioFile} at speed ${speed}x`);
    setIsPlaying(!isPlaying);
    
    // Mock audio playback with timeout to toggle state back
    if (!isPlaying) {
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000); // Simulate 3 seconds of audio playback
    }
  };
  
  const toggleSpeedOptions = () => {
    setShowSpeedOptions(!showSpeedOptions);
  };
  
  const selectSpeed = (newSpeed) => {
    setSpeed(newSpeed);
    setShowSpeedOptions(false);
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

// Add the styles that were missing
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