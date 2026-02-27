import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth, UserRole } from '../context/AuthContext';
import { COLORS, ROLE_COLORS } from '../config/constants';

// Auth Screens
import DashboardScreen from '../screens/app/DashboardScreen';
import ProfileScreen from '../screens/app/ProfileScreen';
import TransactionsScreen from '../screens/app/TransactionsScreen';
import TransferScreen from '../screens/app/TransferScreen';
import TopupScreen from '../screens/app/TopupScreen';
import SettingsScreen from '../screens/app/SettingsScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import UsersManagementScreen from '../screens/admin/UsersManagementScreen';
import AnalyticsScreen from '../screens/admin/AnalyticsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionsScreen}
        options={{
          title: 'Transactions',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: COLORS.primary,
      }}
    >
      <Tab.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen}
        options={{
          title: 'Dashboard',
        }}
      />
      <Tab.Screen 
        name="Users" 
        component={UsersManagementScreen}
        options={{
          title: 'Users',
        }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
        options={{
          title: 'Analytics',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppStack() {
  const { user } = useAuth();
  const isAdmin = ['super_admin', 'admin'].includes(user?.role || '');

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      {isAdmin ? (
        <Stack.Screen 
          name="AdminTabsNavigator" 
          component={AdminTabs}
        />
      ) : (
        <Stack.Screen 
          name="UserTabsNavigator" 
          component={UserTabs}
        />
      )}
      
      {/* Modal screens */}
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen 
          name="Transfer" 
          component={TransferScreen}
        />
        <Stack.Screen 
          name="Topup" 
          component={TopupScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
