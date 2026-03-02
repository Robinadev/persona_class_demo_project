import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface SyncEvent {
  id: string;
  userId: string;
  eventType: 'call_log' | 'user_update' | 'device_update' | 'settings_change';
  data: Record<string, any>;
  syncedAt: string;
  status: 'pending' | 'synced' | 'failed';
}

/**
 * Real-time sync service for mobile-admin communication
 * Uses Supabase real-time subscriptions for instant data sync
 */
export class RealTimeSync {
  private userId: string;
  private subscriptions: any[] = [];
  private syncQueue: SyncEvent[] = [];
  private isOnline: boolean = true;

  constructor(userId: string) {
    this.userId = userId;
    this.setupOnlineListener();
  }

  /**
   * Setup online/offline listener
   */
  private setupOnlineListener() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.processSyncQueue();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  /**
   * Subscribe to real-time updates for user's data
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
   * Subscribe to call logs for the user
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
   * Create a sync event (queue it if offline)
   */
  public async queueSyncEvent(
    eventType: SyncEvent['eventType'],
    data: Record<string, any>
  ): Promise<SyncEvent | null> {
    const event: SyncEvent = {
      id: `${Date.now()}-${Math.random()}`,
      userId: this.userId,
      eventType,
      data,
      syncedAt: new Date().toISOString(),
      status: this.isOnline ? 'pending' : 'pending'
    };

    if (!this.isOnline) {
      this.syncQueue.push(event);
      return event;
    }

    try {
      const { data: syncedEvent, error } = await supabase
        .from('sync_events')
        .insert({
          user_id: this.userId,
          event_type: eventType,
          data,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return syncedEvent as SyncEvent;
    } catch (error) {
      console.error('Error queueing sync event:', error);
      this.syncQueue.push(event);
      return event;
    }
  }

  /**
   * Process queued events when coming back online
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
            status: 'pending',
            created_at: event.syncedAt
          });
      } catch (error) {
        console.error('Error syncing queued event:', error);
        this.syncQueue.push(event);
      }
    }
  }

  /**
   * Log a call event
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
   * Unsubscribe from all subscriptions
   */
  public unsubscribeAll() {
    this.subscriptions.forEach((sub) => {
      supabase.removeSubscription(sub);
    });
    this.subscriptions = [];
  }

  /**
   * Get sync queue status
   */
  public getSyncQueueStatus() {
    return {
      queuedEvents: this.syncQueue.length,
      isOnline: this.isOnline,
      pendingEvents: this.syncQueue.filter((e) => e.status === 'pending').length
    };
  }
}

export default RealTimeSync;
