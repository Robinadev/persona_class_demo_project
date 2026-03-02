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
  const [initialRoute, setInitialRoute] = useState<'Landing' | 'Auth' | 'App' | null>(null);

  useEffect(() => {
    checkInitialRoute();
  }, [isSignedIn]);

  const checkInitialRoute = async () => {
    if (isSignedIn) {
      setInitialRoute('App');
    } else {
      const token = await AsyncStorage.getItem('auth_token');
      const hasSeenLanding = await AsyncStorage.getItem('has_seen_landing');
      
      if (token) {
        setInitialRoute('App');
      } else if (hasSeenLanding) {
        setInitialRoute('Auth');
      } else {
        setInitialRoute('Landing');
      }
    }
  };

  const handleLandingComplete = async () => {
    await AsyncStorage.setItem('has_seen_landing', 'true');
    setInitialRoute('Auth');
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
          cardStyle: { backgroundColor: COLORS.background },
        }}
      >
        {/* Landing/Onboarding */}
        {initialRoute === 'Landing' && (
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ animationEnabled: false }}
          />
        )}

        {/* Auth Stack */}
        {!isSignedIn ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                animationEnabled: true,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{
                animationEnabled: true,
                gestureEnabled: true,
              }}
            />
          </>
        ) : null}

        {/* App Stack */}
        {isSignedIn && (
          <Stack.Screen
            name="AppRoot"
            component={AppStack}
            options={{ animationEnabled: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
