import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DrugItem from '../components/DrugItem';
import { getDrugsByCategory } from '../data/mockData';

const DrugListScreen = ({ navigation, route }) => {
  const { categoryId, categoryName } = route.params;
  const drugs = getDrugsByCategory(categoryId);

  const handleDrugPress = (drug) => {
    navigation.navigate('DrugDetail', { drugId: drug.id });
  };

  const renderDrugItem = ({ item }) => (
    <DrugItem
      drug={item}
      onPress={() => handleDrugPress(item)}
      // In milestone 1, we don't implement the learning list functionality
      inLearningList={false}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        
        <Text style={styles.title}>{categoryName}</Text>
        <Text style={styles.drugCount}>{drugs.length} drugs</Text>
      </View>
      
      <FlatList
        data={drugs}
        renderItem={renderDrugItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No drugs found in this category</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  drugCount: {
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
});

export default DrugListScreen;