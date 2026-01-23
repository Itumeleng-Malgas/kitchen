import { request } from '@umijs/max';

// Subscription Plans
export async function getSubscriptionPlans() {
  return request<API.Response<API.SubscriptionPlan[]>>('/api/subscription/plans', {
    method: 'GET',
  });
}

// Current Subscription
export async function getCurrentSubscription() {
  return request<API.Response<API.Subscription>>('/api/subscription/current', {
    method: 'GET',
  });
}

// Update Subscription
export async function updateSubscription(params: {
  planId: string;
  paymentMethodId?: string;
  prorationBehavior?: 'create_prorations' | 'none';
}) {
  return request<API.Response<{
    subscription: API.Subscription;
    invoice?: API.Invoice;
  }>>('/api/subscription/update', {
    method: 'POST',
    data: params,
  });
}

// Cancel Subscription
export async function cancelSubscription(params?: {
  cancelAtPeriodEnd?: boolean;
}) {
  return request<API.Response<{ message: string }>>('/api/subscription/cancel', {
    method: 'POST',
    data: params,
  });
}

// Payment Methods
export async function getPaymentMethods() {
  return request<API.Response<API.PaymentMethod[]>>('/api/payment/methods', {
    method: 'GET',
  });
}

// Add Payment Method
export async function addPaymentMethod(params: {
  type: string;
  token: string;
  isDefault?: boolean;
}) {
  return request<API.Response<API.PaymentMethod>>('/api/payment/methods', {
    method: 'POST',
    data: params,
  });
}

// Set Default Payment Method
export async function setDefaultPaymentMethod(paymentMethodId: string) {
  return request<API.Response<{ success: boolean }>>(`/api/payment/methods/${paymentMethodId}/default`, {
    method: 'PUT',
  });
}

// Remove Payment Method
export async function removePaymentMethod(paymentMethodId: string) {
  return request<API.Response<{ success: boolean }>>(`/api/payment/methods/${paymentMethodId}`, {
    method: 'DELETE',
  });
}

// Get Invoices
export async function getInvoices(params?: API.ListParams) {
  return request<API.Response<API.Page<API.Invoice>>>('/api/invoices', {
    method: 'GET',
    params,
  });
}

// Get Invoice PDF
export async function getInvoicePdf(invoiceId: string) {
  return request<API.Response<{ url: string }>>(`/api/invoices/${invoiceId}/pdf`, {
    method: 'GET',
  });
}

// Google Pay Payment
export async function createGooglePayPayment(params: {
  paymentData: any;
  planId: string;
  businessId?: string;
}) {
  return request<API.Response<{
    paymentIntent: any;
    subscription: API.Subscription;
  }>>('/api/payment/google-pay', {
    method: 'POST',
    data: params,
  });
}

// Usage Statistics
export async function getUsageStats(params?: {
  period?: 'day' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
}) {
  return request<API.Response<API.UsageStats>>('/api/usage/stats', {
    method: 'GET',
    params,
  });
}