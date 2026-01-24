import { request } from '@umijs/max';

export interface DateRangeParams {
  startDate: string;
  endDate: string;
}

export interface AnalyticsMetrics {
  revenue: number;
  orders: number;
  avgOrderValue: number;
  activeCustomers: number;
  conversionRate: number;
  responseTime: number;
  changes: {
    revenue: number;
    orders: number;
    avgOrderValue: number;
    activeCustomers: number;
    conversionRate: number;
    responseTime: number;
  };
}

export interface TimeSeriesData {
  date: string;
  orders: number;
  revenue: number;
  avgOrderValue: number;
  completed: number;
  pending: number;
  cancelled: number;
}

export interface HourlyData {
  hour: string;
  orders: number;
  messages: number;
  conversionRate: number;
}

export interface CustomerData {
  id: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  avgOrderValue: number;
  favoriteItems: string[];
}

export interface ProductData {
  name: string;
  orders: number;
  revenue: number;
  category: string;
  popularity: number;
  margin: number;
}

export interface MessageMetrics {
  totalMessages: number;
  responseTime: number;
  customerSatisfaction: number;
  automationRate: number;
  commonQuestions: number;
  humanHandoff: number;
  avgTypingTime: number;
}

// Get key metrics
export async function getAnalyticsMetrics(params: DateRangeParams) {
  return request<API.Response<AnalyticsMetrics>>('/api/analytics/metrics', {
    method: 'GET',
    params,
  });
}

// Get time series data
export async function getTimeSeriesData(params: DateRangeParams) {
  return request<API.Response<API.Page<TimeSeriesData>>>('/api/analytics/timeseries', {
    method: 'GET',
    params,
  });
}

// Get hourly data
export async function getHourlyData(params?: { date?: string }) {
  return request<API.Response<HourlyData[]>>('/api/analytics/hourly', {
    method: 'GET',
    params,
  });
}

// Get top customers
export async function getTopCustomers(params: DateRangeParams & { limit?: number }) {
  return request<API.Response<API.Page<CustomerData>>>('/api/analytics/top-customers', {
    method: 'GET',
    params,
  });
}

// Get top products
export async function getTopProducts(params: DateRangeParams) {
  return request<API.Response<API.Page<ProductData>>>('/api/analytics/top-products', {
    method: 'GET',
    params,
  });
}

// Get message metrics
export async function getMessageMetrics(params: DateRangeParams) {
  return request<API.Response<MessageMetrics>>('/api/analytics/message-metrics', {
    method: 'GET',
    params,
  });
}

// Get real-time stats
export async function getRealTimeStats() {
  return request<API.Response<any>>('/api/analytics/realtime', {
    method: 'GET',
  });
}

// Export analytics data
export async function exportAnalyticsData(params: DateRangeParams & { format: 'csv' | 'excel' | 'pdf' }) {
  return request<Blob>('/api/analytics/export', {
    method: 'GET',
    params,
    responseType: 'blob',
  });
}