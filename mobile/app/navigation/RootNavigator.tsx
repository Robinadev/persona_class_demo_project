import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../config/constants';

// Screens
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import AppStack from './AppStack';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isSignedIn, isLoading } = useAuth();
  const [initialRoute, setInitialRoute] = useState<'Landing' | 'Login' | 'AppRoot' | null>(null);

  useEffect(() => {
    checkInitialRoute();
  }, [isSignedIn]);

  const checkInitialRoute = async () => {
    if (isSignedIn) {
      setInitialRoute('AppRoot');
    } else {
      const token = await AsyncStorage.getItem('auth_token');
      const hasSeenLanding = await AsyncStorage.getItem('has_seen_landing');
      
      if (token) {
        setInitialRoute('AppRoot');
      } else if (hasSeenLanding) {
        setInitialRoute('Login');
      } else {
        setInitialRoute('Landing');
      }
    }
  };

  const handleLandingComplete = async () => {
    await AsyncStorage.setItem('has_seen_landing', 'true');
    setInitialRoute('Login');
  };

  if (isLoading || !initialRoute) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background }, // Use contentStyle instead of cardStyle
        }}
      >
        {/* Always include all screens but conditionally render based on auth state */}
        <Stack.Screen 
          name="Landing" 
          component={LandingScreen}
          options={{ animation: 'none' }} // Use animation instead of animationEnabled
        />
        
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: false 
          }}
        />
        
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen}
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: true 
          }}
        />
        
        <Stack.Screen 
          name="AppRoot" 
          component={AppStack}
          options={{ animation: 'none' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}