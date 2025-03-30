import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import TodoItem from './TodoItems';


const TodoList = ({ todos,onToggleComplete, onDeleteTodo }) => {
  if ( todos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No todos yet. Add one to get started!</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()} // Ensure ID is a string
        renderItem={({ item }) => (
          <TodoItem 
            item={item} 
            onToggleComplete={onToggleComplete}
            onDeleteTodo={onDeleteTodo}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1, // Allow it to take up available space
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default TodoList;
