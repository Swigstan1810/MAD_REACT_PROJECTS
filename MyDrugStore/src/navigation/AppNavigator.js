import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

// Import screens
import CategoryScreen from '../screens/CategoryScreen';
import DrugListScreen from '../screens/DrugListScreen';
import DrugDetailScreen from '../screens/DrugDetailScreen';
import LearningListScreen from '../screens/LearningListScreen';
import LearningScreen from '../screens/LearningScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const DrugStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="Categories" component={CategoryScreen} />
      <Stack.Screen name="DrugList" component={DrugListScreen} />
      <Stack.Screen name="DrugDetail" component={DrugDetailScreen} />
    </Stack.Navigator>
  );
};

// Changed screen name from "Learning" to "LearningDetail" to avoid naming conflict
const LearningStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="LearningList" component={LearningListScreen} />
      <Stack.Screen name="LearningDetail" component={LearningScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const currentLearning = useSelector(state => state.learning.currentLearning);
  
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Drugs') {
              iconName = focused ? 'medical' : 'medical-outline';
            } else if (route.name === 'Learning') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'Community') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4A80F0',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Drugs" component={DrugStack} />
        <Tab.Screen 
          name="Learning" 
          component={LearningStack} 
          options={{
            tabBarBadge: currentLearning.length > 0 ? currentLearning.length : null,
          }}
        />
        <Tab.Screen name="Community" component={EmptyScreen} />
        <Tab.Screen name="Profile" component={EmptyScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

// Placeholder for screens that will be implemented in milestone 3
const EmptyScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Coming in the final milestone</Text>
  </View>
);

export default AppNavigator;