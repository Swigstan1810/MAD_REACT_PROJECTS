import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AudioPlayer = ({ gender, audioFile, onStudyPress }) => {
  const [speed, setSpeed] = useState(1.0);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  
  const speedOptions = [0.25, 0.33, 0.75, 1.0];
  
  const handlePlayPress = () => {
    // In milestone 1, we're not implementing actual audio playback
    console.log(`Playing ${audioFile} at speed ${speed}x`);
  };
  
  const toggleSpeedOptions = () => {
    setShowSpeedOptions(!showSpeedOptions);
  };
  
  const selectSpeed = (newSpeed) => {
    setSpeed(newSpeed);
    setShowSpeedOptions(false);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.playerRow}>
        <TouchableOpacity style={styles.iconButton} onPress={handlePlayPress}>
          <Ionicons name="play-circle" size={28} color="#007AFF" />
        </TouchableOpacity>
        
        <View style={styles.genderContainer}>
          <Ionicons 
            name={gender === 'female' ? 'woman' : 'man'} 
            size={22} 
            color={gender === 'female' ? '#FF6B8A' : '#4A80F0'} 
          />
          <Text style={styles.genderLabel}>
            {gender === 'female' ? 'Female' : 'Male'}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.speedButton} onPress={toggleSpeedOptions}>
          <Text style={styles.speedText}>{speed}x</Text>
          <Ionicons name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.studyButton} onPress={onStudyPress}>
          <Text style={styles.studyButtonText}>Study</Text>
        </TouchableOpacity>
      </View>
      
      {showSpeedOptions && (
        <View style={styles.speedOptions}>
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
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
    fontSize: 14,
    marginLeft: 4,
    color: '#444',
  },
  speedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 10,
  },
  speedText: {
    fontSize: 12,
    marginRight: 2,
    color: '#666',
  },
  studyButton: {
    marginLeft: 'auto',
    backgroundColor: '#007AFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  studyButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  speedOptions: {
    position: 'absolute',
    top: 50,
    left: 100,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  speedOption: {
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedSpeed: {
    backgroundColor: '#f0f0f0',
  },
  speedOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedSpeedText: {
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default AudioPlayer;