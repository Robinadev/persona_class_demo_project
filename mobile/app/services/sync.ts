import { createClient } from '@supabase/supabase-js';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_KEY } from '../config/constants';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export interface SyncEvent {
  id: string;
  userId: string;
  eventType: 'call_log' | 'user_update' | 'device_update' | 'settings_change';
  data: Record<string, any>;
  syncedAt: string;
  status: 'pending' | 'synced' | 'failed';
}

/**
 * Mobile real-time sync service
 * Handles offline queue and syncs when connection restored
 */
export class MobileRealTimeSync {
  private userId: string;
  private subscriptions: any[] = [];
  private syncQueue: SyncEvent[] = [];
  private isOnline: boolean = true;
  private listeners: ((status: any) => void)[] = [];

  constructor(userId: string) {
    this.userId = userId;
    this.setupNetworkListener();
    this.loadSyncQueue();
  }

  /**
   * Setup network connectivity listener
   */
  private setupNetworkListener() {
    NetInfo.addEventListener((state) => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isConnected ?? false;

      if (!wasOnline && this.isOnline) {
        this.processSyncQueue();
      }

      this.notifyListeners();
    });
  }

  /**
   * Load sync queue from AsyncStorage
   */
  private async loadSyncQueue() {
    try {
      const stored = await AsyncStorage.getItem(`sync_queue_${this.userId}`);
      if (stored) {
        this.syncQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading sync queue:', error);
    }
  }

  /**
   * Save sync queue to AsyncStorage
   */
  private async saveSyncQueue() {
    try {
      await AsyncStorage.setItem(
        `sync_queue_${this.userId}`,
        JSON.stringify(this.syncQueue)
      );
    } catch (error) {
      console.error('Error saving sync queue:', error);
    }
  }

  /**
   * Subscribe to real-time updates
   */
  public subscribeToUserUpdates(callback: (event: SyncEvent) => void) {
    const subscription = supabase
      .from(`sync_events:user_id=eq.${this.userId}`)
      .on('*', (payload: any) => {
        const event: SyncEvent = {
          id: payload.new?.id || payload.old?.id,
          userId: payload.new?.user_id || payload.old?.user_id,
          eventType: payload.new?.event_type || payload.old?.event_type,
          data: payload.new?.data || payload.old?.data || {},
          syncedAt: payload.new?.created_at || payload.old?.created_at,
          status: payload.new?.status || 'synced'
        };
        callback(event);
      })
      .subscribe();

    this.subscriptions.push(subscription);
    return subscription;
  }

  /**
   * Subscribe to call logs
   */
  public subscribeToCallLogs(callback: (log: any) => void) {
    const subscription = supabase
      .from(`call_logs:user_id=eq.${this.userId}`)
      .on('INSERT', (payload: any) => {
        callback(payload.new);
      })
      .subscribe();

    this.subscriptions.push(subscription);
    return subscription;
  }

  /**
   * Queue a sync event
   */
  public async queueSyncEvent(
    eventType: SyncEvent['eventType'],
    data: Record<string, any>
  ): Promise<SyncEvent> {
    const event: SyncEvent = {
      id: `${Date.now()}-${Math.random()}`,
      userId: this.userId,
      eventType,
      data,
      syncedAt: new Date().toISOString(),
      status: 'pending'
    };

    this.syncQueue.push(event);
    await this.saveSyncQueue();

    if (this.isOnline) {
      this.processSyncQueue();
    }

    return event;
  }

  /**
   * Process queued events
   */
  private async processSyncQueue() {
    if (this.syncQueue.length === 0) return;

    const events = [...this.syncQueue];
    this.syncQueue = [];

    for (const event of events) {
      try {
        await supabase
          .from('sync_events')
          .insert({
            user_id: event.userId,
            event_type: event.eventType,
            data: event.data,
            status: 'synced',
            created_at: event.syncedAt
          });
      } catch (error) {
        console.error('Error syncing event:', error);
        event.status = 'failed';
        this.syncQueue.push(event);
      }
    }

    await this.saveSyncQueue();
  }

  /**
   * Log a call
   */
  public async logCall(callData: {
    recipientPhoneNumber: string;
    duration: number;
    startTime: string;
    endTime: string;
    status: 'completed' | 'missed' | 'failed';
  }) {
    return this.queueSyncEvent('call_log', callData);
  }

  /**
   * Update user profile
   */
  public async updateUserProfile(profileData: Record<string, any>) {
    return this.queueSyncEvent('user_update', profileData);
  }

  /**
   * Update device info
   */
  public async updateDeviceInfo(deviceData: Record<string, any>) {
    return this.queueSyncEvent('device_update', deviceData);
  }

  /**
   * Sync settings
   */
  public async syncSettings(settingsData: Record<string, any>) {
    return this.queueSyncEvent('settings_change', settingsData);
  }

  /**
   * Add listener for sync status changes
   */
  public onSyncStatusChange(callback: (status: any) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  /**
   * Notify all listeners of status change
   */
  private notifyListeners() {
    const status = {
      isOnline: this.isOnline,
      queuedEvents: this.syncQueue.length,
      pendingEvents: this.syncQueue.filter((e) => e.status === 'pending').length
    };

    this.listeners.forEach((listener) => listener(status));
  }

  /**
   * Get sync status
   */
  public getSyncStatus() {
    return {
      isOnline: this.isOnline,
      queuedEvents: this.syncQueue.length,
      pendingEvents: this.syncQueue.filter((e) => e.status === 'pending').length
    };
  }

  /**
   * Cleanup subscriptions
   */
  public unsubscribeAll() {
    this.subscriptions.forEach((sub) => {
      supabase.removeSubscription(sub);
    });
    this.subscriptions = [];
    this.listeners = [];
  }
}

export default MobileRealTimeSync;
