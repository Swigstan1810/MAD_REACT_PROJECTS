import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../redux/authSlice';
import { fetchUserRecords } from '../redux/studyRecordsSlice';

// Import screens
import CategoryScreen from '../screens/CategoryScreen';
import DrugListScreen from '../screens/DrugListScreen';
import DrugDetailScreen from '../screens/DrugDetailScreen';
import LearningListScreen from '../screens/LearningListScreen';
import LearningScreen from '../screens/LearningScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CommunityScreen from '../screens/CommunityScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

// Auth Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
};

// Drug Stack
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

// Learning Stack
const LearningStack = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="LearningList" component={LearningListScreen} />
          <Stack.Screen name="LearningDetail" component={LearningScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthPromptScreen} />
      )}
    </Stack.Navigator>
  );
};

// Auth prompt screen for non-authenticated users
const AuthPromptScreen = ({ navigation }) => {
  return (
    <View style={styles.authPromptContainer}>
      <Ionicons name="lock-closed" size={100} color="#4A80F0" />
      <Text style={styles.authPromptTitle}>Authentication Required</Text>
      <Text style={styles.authPromptText}>
        You need to sign in to access the learning features.
      </Text>
      <TouchableOpacity
        style={styles.authPromptButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.authPromptButtonText}>Sign In / Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

// Profile Stack
const ProfileStack = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="UserProfile" component={ProfileScreen} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

// Community Stack
const CommunityStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="CommunityRankings" component={CommunityScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const dispatch = useDispatch();
  const currentLearning = useSelector(state => state.learning.currentLearning);
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  const [initialRoute, setInitialRoute] = useState('Drugs');
  
  // Load user from storage on app start
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  
  // Fetch user records when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserRecords());
    } else {
      // Set initial route to Profile (which will show Sign In) if not authenticated
      setInitialRoute('Profile');
    }
  }, [isAuthenticated, dispatch]);
  
  // Handle learning tab press for non-authenticated users
  const handleLearningTabPress = (navigation) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'You need to sign in to access the learning features.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Profile') }
        ]
      );
      return true; // Prevent navigation
    }
    return false; // Allow navigation
  };
  
  // Create theme with no animation for initial navigation
  const noAnimationTheme = {
    ...DefaultTheme,
    animation: {
      ...DefaultTheme.animation,
      appear: { duration: 0 },
    },
  };
  
  if (loading) {
    return null; // Return nothing while loading
  }
  
  return (
    <NavigationContainer theme={noAnimationTheme}>
      <Tab.Navigator
        initialRouteName={initialRoute}
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
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              // Prevent navigation if user is not authenticated
              if (handleLearningTabPress(navigation)) {
                e.preventDefault();
              }
            },
          })}
          options={{
            tabBarBadge: isAuthenticated && currentLearning.length > 0 ? currentLearning.length : null,
          }}
        />
        <Tab.Screen name="Community" component={CommunityStack} />
        <Tab.Screen name="Profile" component={ProfileStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  authPromptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  authPromptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  authPromptText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  authPromptButton: {
    backgroundColor: '#4A80F0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  authPromptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AppNavigator;