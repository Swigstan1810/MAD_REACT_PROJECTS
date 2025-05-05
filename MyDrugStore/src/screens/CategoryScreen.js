import React from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, ImageBackground } from 'react-native';
import CategoryCard from '../components/CategoryCard';
import { drugCategories } from '../data/dataAdapter';
import { LinearGradient } from 'expo-linear-gradient';

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
    <ImageBackground 
      source={require('../assets/back1.jpg')}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.20)']}

        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Drug Speak</Text>
            <Text style={styles.subtitle}>Master pharmaceutical pronunciations</Text>
          </View>
          <FlatList
            data={drugCategories}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#f0f0f0',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  listContent: {
    padding: 12,
    paddingBottom: 30,
  },
});

export default CategoryScreen;