import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import CategoryScreen from '../screens/CategoryScreen';
import DrugListScreen from '../screens/DrugListScreen';
import DrugDetailScreen from '../screens/DrugDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Categories"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#fff' },
        }}
      >
        <Stack.Screen name="Categories" component={CategoryScreen} />
        <Stack.Screen name="DrugList" component={DrugListScreen} />
        <Stack.Screen name="DrugDetail" component={DrugDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;