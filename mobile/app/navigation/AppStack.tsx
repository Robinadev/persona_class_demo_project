import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth, UserRole } from '../context/AuthContext';
import { COLORS, ROLE_COLORS } from '../config/constants';
import Ionicons from '@expo/vector-icons/Ionicons';

// User Screens
import DashboardScreen from '../screens/app/DashboardScreen';
import CallScreen from '../screens/app/CallScreen';
import ContactsScreen from '../screens/app/ContactsScreen';
import AddContactScreen from '../screens/app/AddContactScreen';
import CallHistoryScreen from '../screens/app/CallHistoryScreen';
import PlansScreen from '../screens/app/PlansScreen';
import TopupScreen from '../screens/app/TopupScreen';
import BillingScreen from '../screens/app/BillingScreen';
import SendMoneyScreen from '../screens/app/SendMoneyScreen';
import ProfileScreen from '../screens/app/ProfileScreen';
import SettingsScreen from '../screens/app/SettingsScreen';
import RewardsScreen from '../screens/app/RewardsScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminCallsScreen from '../screens/admin/AdminCallsScreen';
import UsersManagementScreen from '../screens/admin/UsersManagementScreen';
import ManageAdminsScreen from '../screens/admin/ManageAdminsScreen';
import AdminReportsScreen from '../screens/admin/AdminReportsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Call') {
            iconName = focused ? 'call' : 'call-outline';
          } else if (route.name === 'Contacts') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Call" 
        component={CallScreen}
        options={{
          tabBarLabel: 'Call',
        }}
      />
      <Tab.Screen 
        name="Contacts" 
        component={ContactsScreen}
        options={{
          tabBarLabel: 'Contacts',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'AdminHome') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'AdminCalls') {
            iconName = focused ? 'call' : 'call-outline';
          } else if (route.name === 'AdminUsers') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'AdminAdmins') {
            iconName = focused ? 'shield' : 'shield-outline';
          } else if (route.name === 'AdminSettings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="AdminHome" 
        component={AdminDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen 
        name="AdminCalls" 
        component={AdminCallsScreen}
        options={{
          tabBarLabel: 'Calls',
        }}
      />
      <Tab.Screen 
        name="AdminUsers" 
        component={UsersManagementScreen}
        options={{
          tabBarLabel: 'Users',
        }}
      />
      <Tab.Screen 
        name="AdminAdmins" 
        component={ManageAdminsScreen}
        options={{
          tabBarLabel: 'Admins',
        }}
      />
      <Tab.Screen 
        name="AdminSettings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
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
          name="CallDetail" 
          component={CallHistoryScreen}
        />
        <Stack.Screen 
          name="AddContact" 
          component={AddContactScreen}
        />
        <Stack.Screen 
          name="Plans" 
          component={PlansScreen}
        />
        <Stack.Screen 
          name="Topup" 
          component={TopupScreen}
        />
        <Stack.Screen 
          name="Billing" 
          component={BillingScreen}
        />
        <Stack.Screen 
          name="SendMoney" 
          component={SendMoneyScreen}
        />
        <Stack.Screen 
          name="Rewards" 
          component={RewardsScreen}
        />
        <Stack.Screen 
          name="AdminReports" 
          component={AdminReportsScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
