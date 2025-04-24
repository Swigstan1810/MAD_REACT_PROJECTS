import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DrugItem = ({ drug, onPress, inLearningList = false }) => {
  return (
    <TouchableOpacity 
      style={[styles.item, inLearningList && styles.inLearningItem]} 
      onPress={onPress}
    >
      <View style={styles.drugInfo}>
        <Text style={[styles.drugName, inLearningList && styles.inLearningText]}>
          {drug.name}
        </Text>
        <Text style={[styles.formula, inLearningList && styles.inLearningText]}>
          {drug.molecularFormulas}
        </Text>
      </View>
      <View style={styles.chevronContainer}>
        <Ionicons 
          name="chevron-forward" 
          size={24} 
          color={inLearningList ? "#999" : "#4A80F0"} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inLearningItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderLeftWidth: 4,
    borderLeftColor: '#4A80F0',
  },
  drugInfo: {
    flex: 1,
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
  chevronContainer: {
    padding: 5,
  }
});

export default DrugItem;