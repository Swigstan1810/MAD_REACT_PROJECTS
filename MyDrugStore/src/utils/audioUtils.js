import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

// Request permissions for audio recording
export const requestRecordingPermission = async () => {
  try {
    const { status } = await Audio.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Failed to get recording permission:', error);
    return false;
  }
};

// Set audio mode for recording
export const setAudioModeForRecording = async (isRecording = true) => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: isRecording,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
    return true;
  } catch (error) {
    console.error('Failed to set audio mode:', error);
    return false;
  }
};

// Create a new recording
export const startRecording = async () => {
  try {
    const hasPermission = await requestRecordingPermission();
    if (!hasPermission) return null;
    
    await setAudioModeForRecording(true);
    
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await recording.startAsync();
    
    return recording;
  } catch (error) {
    console.error('Failed to start recording:', error);
    return null;
  }
};

// Stop and get the URI of a recording
export const stopRecording = async (recording) => {
  try {
    if (!recording) return null;
    
    await recording.stopAndUnloadAsync();
    await setAudioModeForRecording(false);
    
    return recording.getURI();
  } catch (error) {
    console.error('Failed to stop recording:', error);
    return null;
  }
};

// Play audio
export const playAudio = async (audioUri, rate = 1.0) => {
  try {
    const soundObject = new Audio.Sound();
    await soundObject.loadAsync({ uri: audioUri });
    await soundObject.setRateAsync(rate, true);
    await soundObject.playAsync();
    return soundObject;
  } catch (error) {
    console.error('Failed to play audio:', error);
    return null;
  }
};

// Stop and unload a sound
export const stopAudio = async (soundObject) => {
  try {
    if (soundObject) {
      await soundObject.stopAsync();
      await soundObject.unloadAsync();
    }
  } catch (error) {
    console.error('Failed to stop audio:', error);
  }
};

// Save a recording to a permanent location
export const saveRecording = async (uri, filename) => {
  try {
    const documentsDirectory = FileSystem.documentDirectory;
    const newUri = `${documentsDirectory}${filename}`;
    
    await FileSystem.copyAsync({
      from: uri,
      to: newUri
    });
    
    return newUri;
  } catch (error) {
    console.error('Failed to save recording:', error);
    return null;
  }
};

// Delete a recording
export const deleteRecording = async (uri) => {
  try {
    await FileSystem.deleteAsync(uri);
    return true;
  } catch (error) {
    console.error('Failed to delete recording:', error);
    return false;
  }
};

// For the final milestone - calculate score for pronunciation
// This is a simulated implementation
export const evaluateAndScorePronunciation = (recordedAudioUri, referenceAudioUri) => {
  // In a real implementation, this would involve:
  // 1. Audio feature extraction (using DTW, MFCC, or similar techniques)
  // 2. Comparison with the reference audio
  // 3. Scoring based on similarity
  
  // For this assignment, generate a random score between 0 and 100
  return Math.floor(Math.random() * 101);
};