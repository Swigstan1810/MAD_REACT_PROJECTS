import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ImageBackground, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@todo_app_data';

const AddTodoScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    // Create new todo object
    const newTodo = {
      id: Date.now().toString(), // Generate a unique ID
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    try {
      // Get current todos from AsyncStorage
      const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
      let updatedTodos = [];
      
      if (storedTodos !== null) {
        // Parse the JSON string to get the array
        const currentTodos = JSON.parse(storedTodos);
        // Add new todo at the beginning of the array
        updatedTodos = [newTodo, ...currentTodos];
      } else {
        // If no todos exist yet, create an array with just the new todo
        updatedTodos = [newTodo];
      }
      
      // Save the updated todos back to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
      
      // Show success message
      Alert.alert('Success', 'Todo Added Successfully');
      
      // Navigate back to HomeScreen - it will load the updated todos from AsyncStorage
      navigation.goBack();
      
      // Clear form fields for next entry
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error saving todo:', error);
      Alert.alert('Error', 'Failed to save todo. Please try again.');
    }
  };
  
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require('../assets/back2.jpg')} 
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.heading}>Add New Todo</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#666"
          />
          
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            placeholderTextColor="#666"
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <Ionicons name="arrow-back-outline" size={20} color="#fff" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
              <Ionicons name="save-outline" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'rgba(240, 244, 248, 0.2)',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 2,
    borderColor: '#000',
    padding: 15,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    padding: 14,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#666',
    padding: 14,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default AddTodoScreen;