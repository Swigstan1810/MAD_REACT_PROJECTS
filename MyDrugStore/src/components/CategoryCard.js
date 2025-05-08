import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Function to get a gradient color based on category name
const getCategoryGradient = (categoryName) => {
  const gradients = {
    'Antibiotics': ['#6a11cb', '#2575fc'],
    'Antivirals': ['#ff416c', '#ff4b2b'],
    'Antifungals': ['#56ab2f', '#a8e063'],
    'Antihypertensives': ['#4facfe', '#00f2fe'],
    'Antidepressants': ['#f093fb', '#f5576c'],
    'Anti-inflammatory': ['#f83600', '#f9d423'],
    'Pain Relief': ['#1c92d2', '#f2fcfe'],
    'Antihistamines': ['#833ab4', '#fd1d1d'],
    'Sleep Aids': ['#4568dc', '#b06ab3'],
    'Cardiovascular Drugs': ['#4776E6', '#8E54E9'],
    'Diabetes Medications': ['#f953c6', '#b91d73'],
    'Gastrointestinal Drugs': ['#11998e', '#38ef7d'],
    'Respiratory Medications': ['#7b4397', '#dc2430'],
    // Default gradient for any other category
    'default': ['#4776E6', '#8E54E9']
  };

  return gradients[categoryName] || gradients['default'];
};

// Function to get an icon based on category name
const getCategoryIcon = (categoryName) => {
  const icons = {
    'Antibiotics': 'medkit',
    'Antivirals': 'shield',
    'Antifungals': 'leaf',
    'Antihypertensives': 'heart',
    'Antidepressants': 'happy',
    'Anti-inflammatory': 'flame',
    'Pain Relief': 'bandage',
    'Antihistamines': 'water',
    'Sleep Aids': 'moon',
    'Cardiovascular Drugs': 'heart-circle',
    'Diabetes Medications': 'pulse',
    'Gastrointestinal Drugs': 'medical',
    'Respiratory Medications': 'fitness',
    // Default icon for any other category
    'default': 'medical'
  };

  return icons[categoryName] || icons['default'];
};

const CategoryCard = ({ category, onPress }) => {
  const gradientColors = getCategoryGradient(category.name);
  const iconName = getCategoryIcon(category.name);

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={28} color="#fff" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.categoryName}>{category.name}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.drugCount}>{category.count}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 15,
    marginHorizontal: 8,
    marginVertical: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  card: {
    borderRadius: 15,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    flex: 1, // Allow text to flex for better wrapping
    marginRight: 10, // Add space between text and count badge
  },
  countBadge: {
    backgroundColor: 'rgba(255, 253, 253, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    minWidth: 44, // Ensure consistent badge size
    alignItems: 'center', // Center the text
    justifyContent: 'center',
  },
  drugCount: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default CategoryCard;