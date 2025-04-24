import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DrugItem from '../components/DrugItem';
import { getDrugsByCategory } from '../data/mockData';
import { LinearGradient } from 'expo-linear-gradient';

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
      inLearningList={false}
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
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            
            <Text style={styles.title}>{categoryName}</Text>
            <View style={styles.countContainer}>
              <Text style={styles.drugCount}>{drugs.length} drugs</Text>
            </View>
          </View>
          
          <FlatList
            data={drugs}
            renderItem={renderDrugItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No drugs found in this category</Text>
              </View>
            }
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
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 254, 254, 0.1)',
  },
  backButton: {
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  countContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  drugCount: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
  },
});

export default DrugListScreen;