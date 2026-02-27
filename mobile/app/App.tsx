import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';

function RootNavigator() {
  const { isLoading, isSignedIn } = useAuth();

  if (isLoading) {
    return null; // Show splash screen or loading indicator
  }

  return (
    <NavigationContainer>
      {isSignedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
      <StatusBar barStyle="dark-content" />
    </AuthProvider>
  );
}
