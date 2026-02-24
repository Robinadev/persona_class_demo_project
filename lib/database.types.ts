export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone_number: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone_number: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone_number?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          currency: string
          duration_days: number
          call_minutes: number
          sms_count: number
          data_gb: number
          is_active: boolean
          features: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          currency?: string
          duration_days?: number
          call_minutes?: number
          sms_count?: number
          data_gb?: number
          is_active?: boolean
          features?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          currency?: string
          duration_days?: number
          call_minutes?: number
          sms_count?: number
          data_gb?: number
          is_active?: boolean
          features?: Json
          created_at?: string
          updated_at?: string
        }
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: 'active' | 'expired' | 'cancelled'
          start_date: string
          end_date: string
          auto_renew: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status?: 'active' | 'expired' | 'cancelled'
          start_date?: string
          end_date: string
          auto_renew?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          status?: 'active' | 'expired' | 'cancelled'
          start_date?: string
          end_date?: string
          auto_renew?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      wallets: {
        Row: {
          id: string
          user_id: string
          balance: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          wallet_id: string
          type: 'top_up' | 'recharge' | 'send_money' | 'receive_money' | 'plan_purchase' | 'call_charge'
          amount: number
          balance_before: number
          balance_after: number
          status: 'pending' | 'completed' | 'failed' | 'cancelled'
          description: string
          metadata: Json
          reference_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          wallet_id: string
          type: 'top_up' | 'recharge' | 'send_money' | 'receive_money' | 'plan_purchase' | 'call_charge'
          amount: number
          balance_before: number
          balance_after: number
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          description: string
          metadata?: Json
          reference_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          wallet_id?: string
          type?: 'top_up' | 'recharge' | 'send_money' | 'receive_money' | 'plan_purchase' | 'call_charge'
          amount?: number
          balance_before?: number
          balance_after?: number
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          description?: string
          metadata?: Json
          reference_id?: string | null
          created_at?: string
        }
      }
      money_transfers: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          amount: number
          status: 'pending' | 'completed' | 'failed' | 'cancelled'
          note: string | null
          transaction_id: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          amount: number
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          note?: string | null
          transaction_id?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          amount?: number
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          note?: string | null
          transaction_id?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
      contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          phone_number: string
          email: string | null
          avatar_url: string | null
          is_favorite: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone_number: string
          email?: string | null
          avatar_url?: string | null
          is_favorite?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone_number?: string
          email?: string | null
          avatar_url?: string | null
          is_favorite?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      call_logs: {
        Row: {
          id: string
          user_id: string
          contact_id: string | null
          phone_number: string
          contact_name: string | null
          call_type: 'outgoing' | 'incoming' | 'missed'
          call_status: 'completed' | 'missed' | 'rejected' | 'failed'
          duration_seconds: number
          cost: number
          started_at: string
          ended_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          contact_id?: string | null
          phone_number: string
          contact_name?: string | null
          call_type: 'outgoing' | 'incoming' | 'missed'
          call_status: 'completed' | 'missed' | 'rejected' | 'failed'
          duration_seconds?: number
          cost?: number
          started_at?: string
          ended_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          contact_id?: string | null
          phone_number?: string
          contact_name?: string | null
          call_type?: 'outgoing' | 'incoming' | 'missed'
          call_status?: 'completed' | 'missed' | 'rejected' | 'failed'
          duration_seconds?: number
          cost?: number
          started_at?: string
          ended_at?: string | null
          created_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          user_id: string | null
          username: string
          email: string
          password_hash: string
          full_name: string
          role: 'super_admin' | 'admin' | 'support'
          is_active: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          username: string
          email: string
          password_hash: string
          full_name: string
          role?: 'super_admin' | 'admin' | 'support'
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          username?: string
          email?: string
          password_hash?: string
          full_name?: string
          role?: 'super_admin' | 'admin' | 'support'
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string | null
          admin_id: string | null
          action: string
          resource_type: string | null
          resource_id: string | null
          details: Json
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          admin_id?: string | null
          action: string
          resource_type?: string | null
          resource_id?: string | null
          details?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          admin_id?: string | null
          action?: string
          resource_type?: string | null
          resource_id?: string | null
          details?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Functions: {
      log_activity: {
        Args: {
          p_user_id: string | null
          p_admin_id: string | null
          p_action: string
          p_resource_type?: string | null
          p_resource_id?: string | null
          p_details?: Json
          p_ip_address?: string | null
          p_user_agent?: string | null
        }
        Returns: string
      }
    }
  }
}
