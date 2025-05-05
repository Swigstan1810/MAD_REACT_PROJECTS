import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  ImageBackground 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import DrugItem from '../components/DrugItem';

const LearningListScreen = ({ navigation }) => {
  const [currentExpanded, setCurrentExpanded] = useState(true);
  const [finishedExpanded, setFinishedExpanded] = useState(false);
  
  const currentLearning = useSelector(state => state.learning.currentLearning);
  const finished = useSelector(state => state.learning.finished);
  
  const handleDrugPress = (drug, isFinished) => {
    navigation.navigate('LearningDetail', { drugId: drug.id, isFinished });
  };
  
  const renderDrugItem = ({ item }, isFinished) => (
    <DrugItem
      drug={item}
      onPress={() => handleDrugPress(item, isFinished)}
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
            <Text style={styles.title}>Learning List</Text>
          </View>
          
          <View style={styles.content}>
            {/* Current Learning Section */}
            <View style={styles.section}>
              <TouchableOpacity 
                style={styles.sectionHeader}
                onPress={() => setCurrentExpanded(!currentExpanded)}
              >
                <Text style={styles.sectionTitle}>
                  Current Learning ({currentLearning.length})
                </Text>
                <Ionicons 
                  name={currentExpanded ? "remove-circle" : "add-circle"} 
                  size={24} 
                  color="#fff" 
                />
              </TouchableOpacity>
              
              {currentExpanded && (
                <FlatList
                  data={currentLearning}
                  renderItem={(item) => renderDrugItem(item, false)}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.listContent}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>No drugs in your learning list</Text>
                    </View>
                  }
                />
              )}
            </View>
            
            {/* Finished Section */}
            <View style={styles.section}>
              <TouchableOpacity 
                style={styles.sectionHeader}
                onPress={() => setFinishedExpanded(!finishedExpanded)}
              >
                <Text style={styles.sectionTitle}>
                  Finished ({finished.length})
                </Text>
                <Ionicons 
                  name={finishedExpanded ? "remove-circle" : "add-circle"} 
                  size={24} 
                  color="#fff" 
                />
              </TouchableOpacity>
              
              {finishedExpanded && (
                <FlatList
                  data={finished}
                  renderItem={(item) => renderDrugItem(item, true)}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.listContent}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>No finished drugs</Text>
                    </View>
                  }
                />
              )}
            </View>
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default LearningListScreen;