import { request } from '@umijs/max';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'ready' | 'completed' | 'cancelled';
  payment: 'paid' | 'pending' | 'failed';
  items: OrderItem[];
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deliveryType: 'pickup' | 'delivery';
  estimatedTime?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  notes?: string;
}

export interface OrderStats {
  total: number;
  revenue: number;
  pending: number;
  processing: number;
  completed: number;
  cancelled: number;
  avgOrderValue: number;
  todayOrders: number;
}

export interface CreateOrderRequest {
  customerName: string;
  phone: string;
  deliveryType: 'pickup' | 'delivery';
  address?: string;
  notes?: string;
  items: Array<{
    productId: string;
    quantity: number;
    notes?: string;
  }>;
}

export interface UpdateOrderStatusRequest {
  status: Order['status'];
  notes?: string;
}

// Get orders
export async function getOrders(params?: {
  page?: number;
  size?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}) {
  return request<API.Response<API.Page<Order>>>('/api/orders', {
    method: 'GET',
    params,
  });
}

// Get order by ID
export async function getOrder(orderId: string) {
  return request<API.Response<Order>>(`/api/orders/${orderId}`);
}

// Create order
export async function createOrder(data: CreateOrderRequest) {
  return request<API.Response<Order>>('/api/orders', {
    method: 'POST',
    data,
  });
}

// Update order status
export async function updateOrderStatus(orderId: string, data: UpdateOrderStatusRequest) {
  return request<API.Response<{ success: boolean }>>(`/api/orders/${orderId}/status`, {
    method: 'PUT',
    data,
  });
}

// Update order
export async function updateOrder(orderId: string, data: Partial<Order>) {
  return request<API.Response<Order>>(`/api/orders/${orderId}`, {
    method: 'PUT',
    data,
  });
}

// Delete order
export async function deleteOrder(orderId: string) {
  return request<API.Response<{ success: boolean }>>(`/api/orders/${orderId}`, {
    method: 'DELETE',
  });
}

// Get order statistics
export async function getOrderStats(params?: {
  startDate?: string;
  endDate?: string;
}) {
  return request<API.Response<OrderStats>>('/api/orders/stats', {
    method: 'GET',
    params,
  });
}

// Export orders
export async function exportOrders(params: {
  format: 'csv' | 'excel' | 'pdf';
  startDate?: string;
  endDate?: string;
  status?: string;
}) {
  return request<Blob>('/api/orders/export', {
    method: 'GET',
    params,
    responseType: 'blob',
  });
}

// Send order notification
export async function sendOrderNotification(orderId: string, type: 'whatsapp' | 'sms' | 'email') {
  return request<API.Response<{ success: boolean }>>(`/api/orders/${orderId}/notify`, {
    method: 'POST',
    data: { type },
  });
}

// Bulk update orders
export async function bulkUpdateOrders(data: {
  orderIds: string[];
  status: Order['status'];
}) {
  return request<API.Response<{ updated: number }>>('/api/orders/bulk', {
    method: 'PUT',
    data,
  });
}