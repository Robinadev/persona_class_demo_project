import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class AdminAPIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 10000,
    });

    this.client.interceptors.request.use((config) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  setToken(token: string) {
    localStorage.setItem('admin_token', token);
  }

  getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  }

  clearToken() {
    localStorage.removeItem('admin_token');
  }

  // Auth
  login(email: string, password: string) {
    return this.client.post('/auth/login', { email, password });
  }

  logout() {
    this.clearToken();
    return this.client.post('/auth/logout');
  }

  // Users
  getUsers(limit = 50, offset = 0, role?: string, search?: string) {
    return this.client.get('/users', {
      params: { limit, offset, role, search },
    });
  }

  getUser(id: string) {
    return this.client.get(`/users/${id}`);
  }

  updateUserRole(id: string, role: string) {
    return this.client.put(`/users/${id}/role`, { role });
  }

  deactivateUser(id: string) {
    return this.client.post(`/users/${id}/deactivate`);
  }

  // Transactions
  getTransactions(limit = 100, offset = 0, type?: string) {
    return this.client.get('/transactions', {
      params: { limit, offset, type },
    });
  }

  getTransaction(id: string) {
    return this.client.get(`/transactions/${id}`);
  }

  // Analytics
  getDashboardStats() {
    return this.client.get('/analytics/dashboard');
  }

  getUsersByRole() {
    return this.client.get('/analytics/users-by-role');
  }

  getTransactionTrends(days = 30) {
    return this.client.get('/analytics/transaction-trends', {
      params: { days },
    });
  }
}

export const adminApi = new AdminAPIClient();
