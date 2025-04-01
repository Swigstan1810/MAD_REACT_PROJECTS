import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  ImageBackground,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TodoList from '../components/ToDoLists';
import AddButton from '../components/AddButton';
import { todos as initialTodos } from '../data/codedata';
const STORAGE_KEY = '@todo_app_data';

const HomeScreen = ({ navigation, route }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load todos from AsyncStorage whenever the screen is focused
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true);
        const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
        console.log("Stored Todos from AsyncStorage:", storedTodos); // Debug log
  
        if (storedTodos !== null && storedTodos !== "[]") {
          setTodos(JSON.parse(storedTodos));
          console.log("Loaded Todos from AsyncStorage:", JSON.parse(storedTodos));
        } else {
          console.log("No stored todos, saving initialTodos...");
          setTodos(initialTodos);
  
          // Save initialTodos to AsyncStorage
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialTodos));
  
          
          const checkSavedTodos = await AsyncStorage.getItem(STORAGE_KEY);
          console.log("Todos saved successfully:", checkSavedTodos);
        }
      } catch (error) {
        console.error("Error loading todos:", error);
        setTodos(initialTodos); // Fallback to initial todos
      } finally {
        setLoading(false);
      }
    };
    
    // Add a listener for when the screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadTodos();
    });
    
    // Initial load
    loadTodos();
    
    // Clean up listener on unmount
    return unsubscribe;
  }, [navigation]);
  
  const handleAddTodo = () => {
    navigation.navigate('AddTodo');
  };

  // Handle todo completion toggle
  const toggleTodoComplete = async (id) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    setTodos(updatedTodos);
    
    // Save the updated todos to AsyncStorage
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
      console.log("Todos updated in AsyncStorage after completion toggle");
    } catch (error) {
      console.error('Error saving updated todos:', error);
    }
  };

  // Handle todo deletion
  const deleteTodo = async (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    
    setTodos(updatedTodos);
    
    // Save the updated todos to AsyncStorage
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
      console.log("Todos updated in AsyncStorage after deletion");
    } catch (error) {
      console.error('Error saving updated todos after deletion:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading your todos...</Text>
      </View>
    );
  }

  return (
    <ImageBackground 
      source={require('../assets/background.jpg')} 
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#007bff" />
        <Text style={styles.title}>My Todo List</Text>
        <TodoList 
          todos={todos} 
          onToggleComplete={toggleTodoComplete}
          onDeleteTodo={deleteTodo}
        />
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
    flex: 0.9,
    padding: 16,
    backgroundColor: 'rgba(240, 244, 248, 0.7)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});

export default HomeScreen;