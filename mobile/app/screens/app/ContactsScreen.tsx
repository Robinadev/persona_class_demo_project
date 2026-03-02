import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  TextInput,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../config/constants';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  avatar?: string;
  isFavorite: boolean;
}

export default function ContactsScreen({ navigation }: any) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (searchText.trim()) {
      const filtered = contacts.filter(
        c =>
          c.name.toLowerCase().includes(searchText.toLowerCase()) ||
          c.phoneNumber.includes(searchText)
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchText, contacts]);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      // Mock data
      setContacts([
        {
          id: '1',
          name: 'John Doe',
          phoneNumber: '+1 (555) 123-4567',
          isFavorite: true,
        },
        {
          id: '2',
          name: 'Jane Smith',
          phoneNumber: '+1 (555) 987-6543',
          isFavorite: false,
        },
        {
          id: '3',
          name: 'Bob Johnson',
          phoneNumber: '+1 (555) 555-5555',
          isFavorite: true,
        },
      ]);
    } catch (error) {
      console.error('Load contacts error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCall = (phoneNumber: string) => {
    // Navigate to call screen with number pre-filled
    navigation.navigate('Call');
  };

  const toggleFavorite = (id: string) => {
    setContacts(prev =>
      prev.map(c => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  const handleAddContact = () => {
    navigation.navigate('AddContact');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contacts</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddContact}
        >
          <Ionicons name="add-circle" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            placeholderTextColor={COLORS.muted}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Contacts List */}
      <FlatList
        data={filteredContacts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleCall(item.phoneNumber)}
          >
            <View style={styles.contactAvatar}>
              <Text style={styles.avatarText}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
            </View>

            <View style={styles.contactActions}>
              <TouchableOpacity
                style={styles.actionIconButton}
                onPress={() => toggleFavorite(item.id)}
              >
                <Ionicons
                  name={item.isFavorite ? 'star' : 'star-outline'}
                  size={20}
                  color={item.isFavorite ? COLORS.primary : COLORS.muted}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.callIconButton}
                onPress={() => handleCall(item.phoneNumber)}
              >
                <Ionicons name="call" size={18} color={COLORS.background} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />

      {filteredContacts.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={48} color={COLORS.muted} />
          <Text style={styles.emptyText}>
            {searchText ? 'No contacts found' : 'No contacts yet'}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchText ? 'Try a different search' : 'Add a contact to get started'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  addButton: {
    padding: 4,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.foreground,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contactItem: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.background,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.foreground,
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 12,
    color: COLORS.muted,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionIconButton: {
    padding: 6,
  },
  callIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.foreground,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 4,
  },
});
