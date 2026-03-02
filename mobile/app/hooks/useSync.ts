import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import MobileRealTimeSync from '../services/sync';

export const useSync = () => {
  const { user } = useAuth();
  const [syncService, setSyncService] = useState<MobileRealTimeSync | null>(null);
  const [syncStatus, setSyncStatus] = useState({
    isOnline: true,
    queuedEvents: 0,
    pendingEvents: 0,
  });

  useEffect(() => {
    if (!user?.id) return;

    const sync = new MobileRealTimeSync(user.id);
    setSyncService(sync);

    // Subscribe to sync status changes
    const unsubscribe = sync.onSyncStatusChange((status) => {
      setSyncStatus(status);
    });

    return () => {
      unsubscribe();
      sync.unsubscribeAll();
    };
  }, [user?.id]);

  const logCall = useCallback(
    async (callData: {
      recipientPhoneNumber: string;
      duration: number;
      startTime: string;
      endTime: string;
      status: 'completed' | 'missed' | 'failed';
    }) => {
      if (!syncService) return null;
      return syncService.logCall(callData);
    },
    [syncService]
  );

  const updateProfile = useCallback(
    async (profileData: Record<string, any>) => {
      if (!syncService) return null;
      return syncService.updateUserProfile(profileData);
    },
    [syncService]
  );

  const syncSettings = useCallback(
    async (settingsData: Record<string, any>) => {
      if (!syncService) return null;
      return syncService.syncSettings(settingsData);
    },
    [syncService]
  );

  const subscribeToCallLogs = useCallback(
    (callback: (log: any) => void) => {
      if (!syncService) return null;
      return syncService.subscribeToCallLogs(callback);
    },
    [syncService]
  );

  const subscribeToUserUpdates = useCallback(
    (callback: (event: any) => void) => {
      if (!syncService) return null;
      return syncService.subscribeToUserUpdates(callback);
    },
    [syncService]
  );

  return {
    syncStatus,
    logCall,
    updateProfile,
    syncSettings,
    subscribeToCallLogs,
    subscribeToUserUpdates,
    isOnline: syncStatus.isOnline,
    hasPendingSync: syncStatus.pendingEvents > 0,
  };
};
