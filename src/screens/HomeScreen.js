import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import TodoList from '../components/ToDoLists';
import AddButton from '../components/AddButton';
import { todos as initialTodos } from '../data/codedata';

const HomeScreen = () => {
  const [todos, setTodos] = useState(initialTodos);
  
  const handleAddTodo = () => {
    // This function will be implemented in later milestones
    console.log('Add todo pressed');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007bff" />
      <Text style={styles.title}>My Todo List</Text>
      <TodoList todos={todos} />
      <AddButton onPress={handleAddTodo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
});

export default HomeScreen;