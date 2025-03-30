import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

const TodoItem = ({ item, onToggleComplete, onDeleteTodo }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  

  return (
    <View style={styles.todoItemContainer}>
      {/* Contracted view - always visible */}
      <View style={styles.headerRow}>
        <Text style={[
          styles.todoTitle, 
          item.completed && styles.completedText
        ]}>
          {item.title || item.text}
        </Text>
        <TouchableOpacity onPress={toggleExpand}>
          <Ionicons 
            name={expanded ? "caret-up-outline" : "caret-down-outline"} 
            size={24} 
            color="#555" 
          />
        </TouchableOpacity>
      </View>

      {/* Expanded view - only visible when expanded */}
      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.todoDescription}>
            {item.description || "No description available"}
          </Text>
          
          <View style={styles.controlPanel}>
            {!item.completed && (
              <TouchableOpacity 
                style={styles.controlButton} 
                onPress={() => onToggleComplete(item.id)}
              >
                <Ionicons name="checkmark-circle-outline" size={24} color="green" />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.controlButton} 
              onPress={() => onDeleteTodo(item.id)}
            >
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  todoItemContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  expandedContent: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  todoDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  controlPanel: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  controlButton: {
    padding: 5,
    marginLeft: 15,
  },
});

export default TodoItem;