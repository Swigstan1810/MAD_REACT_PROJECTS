import React from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';
import CategoryCard from '../components/CategoryCard';
import { drugCategories } from '../data/mockData';

const CategoryScreen = ({ navigation }) => {
  const handleCategoryPress = (category) => {
    navigation.navigate('DrugList', { 
      categoryId: category.id,
      categoryName: category.name
    });
  };

  const renderCategoryCard = ({ item }) => (
    <CategoryCard
      category={item}
      onPress={() => handleCategoryPress(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Drug </Text>
        <Text style={styles.subtitle}>Select a category to view drugs</Text>
      </View>
      <FlatList
        data={drugCategories}
        renderItem={renderCategoryCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 12,
  },
});

export default CategoryScreen;