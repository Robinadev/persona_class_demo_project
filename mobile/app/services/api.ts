import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../config/constants';

class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 10000,
    });

    this.client.interceptors.request.use(async (config) => {
      const token = await this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, clear it
          await SecureStore.deleteItemAsync('auth_token');
          this.token = null;
        }
        throw error;
      }
    );
  }

  async setToken(token: string) {
    this.token = token;
    await SecureStore.setItemAsync('auth_token', token);
  }

  async getToken(): Promise<string | null> {
    if (this.token) return this.token;
    try {
      this.token = await SecureStore.getItemAsync('auth_token');
      return this.token;
    } catch {
      return null;
    }
  }

  async clearToken() {
    this.token = null;
    await SecureStore.deleteItemAsync('auth_token');
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    if (response.data.token) {
      await this.setToken(response.data.token);
    }
    return response.data;
  }

  async sendOTP(phoneNumber: string) {
    return this.client.post('/auth/send-otp', { phoneNumber });
  }

  async verifyOTP(phoneNumber: string, code: string) {
    const response = await this.client.post('/auth/verify-otp', {
      phoneNumber,
      code,
    });
    if (response.data.token) {
      await this.setToken(response.data.token);
    }
    return response;
  }

  async resendOTP(phoneNumber: string) {
    return this.client.post('/auth/resend-otp', { phoneNumber });
  }

  async signup(email: string, password: string, full_name: string, role: string = 'user') {
    return this.client.post('/auth/signup', {
      email,
      password,
      full_name,
      role,
    });
  }

  async logout() {
    await this.clearToken();
    return this.client.post('/auth/logout');
  }

  async refreshToken() {
    const response = await this.client.post('/auth/refresh');
    if (response.data.token) {
      await this.setToken(response.data.token);
    }
    return response.data;
  }

  // User endpoints
  async getProfile() {
    return this.client.get('/users/me');
  }

  async updateProfile(data: any) {
    return this.client.put('/users/me', data);
  }

  async getUsers(limit = 50, offset = 0, role?: string, search?: string) {
    return this.client.get('/users', {
      params: { limit, offset, role, search },
    });
  }

  async getUser(id: string) {
    return this.client.get(`/users/${id}`);
  }

  // Transaction endpoints
  async getTransactions(limit = 50, offset = 0, type?: string) {
    return this.client.get('/transactions', {
      params: { limit, offset, type },
    });
  }

  async getTransaction(id: string) {
    return this.client.get(`/transactions/${id}`);
  }

  async createTransfer(recipient_id: string, amount: number, description: string) {
    return this.client.post('/transactions/transfer', {
      recipient_id,
      amount,
      description,
    });
  }

  async createTopup(amount: number, description: string) {
    return this.client.post('/transactions/topup', {
      amount,
      description,
    });
  }

  // Call endpoints
  async getCallHistory(limit = 50, offset = 0) {
    return this.client.get('/calls/history', {
      params: { limit, offset },
    });
  }

  async logCall(callData: any) {
    return this.client.post('/calls/log', callData);
  }

  // Contact endpoints
  async getContacts(limit = 100, offset = 0) {
    return this.client.get('/contacts', {
      params: { limit, offset },
    });
  }

  async addContact(contactData: any) {
    return this.client.post('/contacts', contactData);
  }

  async updateContact(id: string, contactData: any) {
    return this.client.put(`/contacts/${id}`, contactData);
  }

  async deleteContact(id: string) {
    return this.client.delete(`/contacts/${id}`);
  }

  // Plans endpoints
  async getPlans() {
    return this.client.get('/plans');
  }

  async getPlanDetails(id: string) {
    return this.client.get(`/plans/${id}`);
  }

  async subscribeToPlan(planId: string) {
    return this.client.post('/subscriptions', { planId });
  }

  // Wallet endpoints
  async getWalletBalance() {
    return this.client.get('/wallets/balance');
  }

  async getWalletTransactions(limit = 50, offset = 0) {
    return this.client.get('/wallets/transactions', {
      params: { limit, offset },
    });
  }

  // Analytics endpoints (admin only)
  async getDashboardStats() {
    return this.client.get('/analytics/dashboard');
  }

  async getUsersByRole() {
    return this.client.get('/analytics/users-by-role');
  }

  async getTransactionTrends(days = 30) {
    return this.client.get('/analytics/transaction-trends', {
      params: { days },
    });
  }

  // Health check
  async healthCheck() {
    return this.client.get('/health');
  }
}

export const api = new APIClient();
