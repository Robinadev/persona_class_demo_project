import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import { COLORS } from '../config/constants';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ 
          animationTypeForReplace: 'pop' 
        }} 
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}
