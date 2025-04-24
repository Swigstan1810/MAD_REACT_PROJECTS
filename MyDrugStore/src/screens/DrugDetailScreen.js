// src/screens/DrugDetailScreen.js

import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AudioPlayer from '../components/AudioPlayer';
import { getDrugById, getCategoryNameById } from '../data/mockData';

const DrugDetailScreen = ({ navigation, route }) => {
  const { drugId } = route.params;
  const drug = getDrugById(drugId);

  if (!drug) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Drug Not Found</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Sorry, we couldn't find information for this drug.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleStudyPress = () => {
    // Placeholder for future feature
    console.log(`Adding ${drug.name} to learning list`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{drug.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Molecular Formula</Text>
          <Text style={styles.formula}>{drug.molecularFormulas}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{drug.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoryContainer}>
            {drug.categories.map((categoryId) => (
              <View style={styles.categoryBadge} key={categoryId}>
                <Text style={styles.categoryText}>
                  {getCategoryNameById(categoryId)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pronunciations</Text>

          <AudioPlayer 
            gender="female"
            audioFile={drug.femaleAudio}
            onStudyPress={handleStudyPress}
          />

          <AudioPlayer 
            gender="male"
            audioFile={drug.maleAudio}
            onStudyPress={handleStudyPress}
          />
        </View>
      </ScrollView>
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
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  formula: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#444',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: '#e1f5fe',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    color: '#0277bd',
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default DrugDetailScreen;
