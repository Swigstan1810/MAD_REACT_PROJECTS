import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DrugItem = ({ drug, onPress, inLearningList = false }) => {
  return (
    <TouchableOpacity 
      style={[styles.item, inLearningList && styles.inLearningItem]} 
      onPress={onPress}
    >
      <Text style={[styles.drugName, inLearningList && styles.inLearningText]}>
        {drug.name}
      </Text>
      <Text style={[styles.formula, inLearningList && styles.inLearningText]}>
        {drug.molecularFormulas}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inLearningItem: {
    backgroundColor: '#f8f8f8',
  },
  drugName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  formula: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  inLearningText: {
    color: '#999',
  },
});

export default DrugItem;