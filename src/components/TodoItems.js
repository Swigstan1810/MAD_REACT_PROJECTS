import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TodoItem = ({ text }) => {
  return (
    <View style={styles.todoItemContainer}>
      <Text style={styles.todoItem}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  todoItemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  todoItem: {
    fontSize: 18,
    color: '#555',
  },
});

export default TodoItem;