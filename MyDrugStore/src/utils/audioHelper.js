import { Audio } from 'expo-av';

// Request permissions for audio recording
export const requestRecordingPermission = async () => {
  try {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access microphone is required!');
      return false;
    }
    return true;
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
  } catch (error) {
    console.error('Failed to set audio mode:', error);
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

// Play audio with a specified speed
export const playAudio = async (audioUri, rate = 1.0) => {
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUri },
      { 
        shouldPlay: true,
        rate: rate,
        volume: 1.0 
      }
    );
    
    return sound;
  } catch (error) {
    console.error('Failed to play audio:', error);
    return null;
  }
};

// For future milestones - calculate score for pronunciation
export const calculateScore = (recordedAudio, referenceAudio) => {
  return Math.floor(Math.random() * 101);
};