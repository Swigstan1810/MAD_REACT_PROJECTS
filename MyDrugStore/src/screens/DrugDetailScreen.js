import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  ImageBackground,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import AudioPlayer from '../components/AudioPlayer';
import { getDrugById, getCategoryNameById } from '../data/dataAdapter';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const DrugDetailScreen = ({ navigation, route }) => {
  const { drugId } = route.params;
  const drug = getDrugById(drugId);
  
  const currentLearning = useSelector(state => state.learning.currentLearning);
  const finished = useSelector(state => state.learning.finished);
  
  const isDrugInLearning = drug && 
    (currentLearning.some(item => item.id === drug.id) || 
     finished.some(item => item.id === drug.id));

  if (!drug) {
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
              <Text style={styles.title}>Drug Not Found</Text>
            </View>
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={80} color="rgba(255,255,255,0.8)" />
              <Text style={styles.errorText}>
                Sorry, we couldn't find information for this drug.
              </Text>
              <TouchableOpacity 
                style={styles.returnButton}
                onPress={() => navigation.navigate('Categories')}
              >
                <Text style={styles.returnButtonText}>Return to Categories</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    );
  }

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
            <Text style={styles.title}>{drug.name}</Text>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.card}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Molecular Formula</Text>
                <Text style={styles.formula}>{drug.molecularFormulas}</Text>
              </View>

              {/* Add Other Names section if available */}
              {drug.otherNames && drug.otherNames.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Other Names</Text>
                  <Text style={styles.otherNames}>
                    {drug.otherNames.join(', ')}
                  </Text>
                </View>
              )}

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
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Pronunciations</Text>

              <AudioPlayer 
                gender="female"
                audioFile={drug.femaleAudio}
                drug={drug}
              />

              <AudioPlayer 
                gender="male"
                audioFile={drug.maleAudio}
                drug={drug}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

// Add the styles definition here - this was the missing part
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
  backButton: {
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  content: {
    padding: 15,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  formula: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#444',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 10,
    borderRadius: 10,
  },
  // Add style for other names
  otherNames: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 10,
    borderRadius: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: '#444',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: '#4A80F0',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  returnButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#fff',
  },
  returnButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DrugDetailScreen;