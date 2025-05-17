import React, { useState, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/components/SplashScreen';
import { Animated } from 'react-native';
import * as SplashScreenExpo from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreenExpo.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // Simulate some loading time
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Start fade-in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
        
        // Set app as ready
        setAppIsReady(true);
        
        // Hide expo splash screen
        await SplashScreenExpo.hideAsync();
        
        // Show our custom splash screen for 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Fade out our splash screen
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(() => {
          // Hide our splash screen
          setShowSplash(false);
        });
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [fadeAnim]);

  if (!appIsReady || showSplash) {
    return <SplashScreen fadeAnim={fadeAnim} />;
  }

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}