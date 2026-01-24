import { request } from '@umijs/max';

export interface DashboardMetrics {
  todayOrders: number;
  todayRevenue: number;
  activeCustomers: number;
  messagesToday: number;
  avgResponseTime: number;
  completionRate: number;
  changes: {
    orders: number;
    revenue: number;
    customers: number;
    messages: number;
    responseTime: number;
    completionRate: number;
  };
}

export interface OrderTrend {
  date: string;
  orders: number;
  revenue: number;
}

export interface TopProduct {
  name: string;
  orders: number;
  revenue: number;
  growth: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  phone: string;
  total: number;
  status: string;
  items: number;
  time: string;
}

export interface MessageStat {
  hour: string;
  messages: number;
  orders: number;
  conversion: number;
}

export interface PeakHour {
  hour: string;
  orders: number;
  conversion: number;
}

// Get dashboard metrics
export async function getDashboardMetrics() {
  return request<API.Response<DashboardMetrics>>('/api/dashboard/metrics');
}

// Get order trends
export async function getOrderTrends(params?: {
  days?: number;
  startDate?: string;
  endDate?: string;
}) {
  return request<API.Response<OrderTrend[]>>('/api/dashboard/trends', {
    method: 'GET',
    params,
  });
}

// Get top products
export async function getTopProducts(params?: {
  limit?: number;
  period?: 'today' | 'week' | 'month';
}) {
  return request<API.Response<TopProduct[]>>('/api/dashboard/top-products', {
    method: 'GET',
    params,
  });
}

// Get recent orders
export async function getRecentOrders(params?: { limit?: number }) {
  return request<API.Response<RecentOrder[]>>('/api/dashboard/recent-orders', {
    method: 'GET',
    params,
  });
}

// Get message stats
export async function getMessageStats(params?: { date?: string }) {
  return request<API.Response<MessageStat[]>>('/api/dashboard/message-stats', {
    method: 'GET',
    params,
  });
}

// Get peak hour
export async function getPeakHour(params?: { date?: string }) {
  return request<API.Response<PeakHour>>('/api/dashboard/peak-hour', {
    method: 'GET',
    params,
  });
}

// Get customer satisfaction
export async function getCustomerSatisfaction(params?: {
  startDate?: string;
  endDate?: string;
}) {
  return request<API.Response<{ rating: number; totalRatings: number }>>(
    '/api/dashboard/satisfaction',
    { method: 'GET', params }
  );
}

// Get real-time updates
export async function getRealTimeUpdates() {
  return request<API.Response<{
    newOrders: number;
    newMessages: number;
    pendingOrders: number;
  }>>('/api/dashboard/realtime');
}