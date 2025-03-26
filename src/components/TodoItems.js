import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

const TodoItem = ({ text }) => {
  return (
    <View style={styles.todoItemContainer}>
      <Text style={styles.todoItem}>{text}</Text>
      <Ionicons name="ellipse-outline" size={26} color="#555" style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  todoItemContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  todoItem: {
    fontSize: 18,
    color: '#555',
  },
  icon:{
    margin: 10,
  },
});

export default TodoItem;