import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ImageBackground } from 'react-native';
import TodoList from '../components/ToDoLists';
import AddButton from '../components/AddButton';
import { todos as initialTodos } from '../data/codedata';

const HomeScreen = ({ navigation }) => {
  const [todos, setTodos] = useState(initialTodos);
  
  const handleAddTodo = () => {
    navigation.navigate('AddTodo');
  };

  return (
    <ImageBackground 
      source={require('../assets/background.jpg')} 
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#007bff" />
        <Text style={styles.title}>My Todo List</Text>
        <TodoList todos={todos} />
        <AddButton onPress={handleAddTodo} />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(240, 244, 248, 0.7)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#333',
    textAlign: 'center',
  },
});

export default HomeScreen;