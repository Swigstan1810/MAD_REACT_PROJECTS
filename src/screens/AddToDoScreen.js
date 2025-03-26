import React, { useState } from 'react';
import { View, Text, TextInput,  TouchableOpacity, ImageBackground ,StyleSheet } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

const AddTodoScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    // This will be updated to actually add the todo
    console.log('New todo:', { title, description });
    navigation.goBack(); // Return to the previous screen
  };
  const cancel =()=>{
    navigation.goBack();
  };




  return (
    <ImageBackground
          source={require('../assets/back2.jpg')} 
          style={styles.backgroundImage}
        >
    
      <View style={styles.container}>
        <Text style={styles.heading}>Add New Todo</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Add Todo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancel} onPress={cancel}>
          <Ionicons name="close" size={34} color="black" />
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
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
    padding: 20,
    backgroundColor: 'rgba(240, 244, 248, 0.1)',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: '#black',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  cancel: {
    height:'20px',
    width:'400px',
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    padding: 2,
    borderRadius: 2,
    
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default AddTodoScreen;