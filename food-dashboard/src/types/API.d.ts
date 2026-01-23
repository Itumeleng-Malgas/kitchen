declare namespace API {
  // Common Response Interface
  interface Response<T = any> {
    success: boolean;
    data: T;
    errorCode?: string;
    errorMessage?: string;
    showType?: 'silent' | 'warn' | 'error' | 'notification' | 'redirect';
    traceId?: string;
    host?: string;
  }

  // Pagination Interface
  interface Page<T = any> {
    list: T[];
    current: number;
    pageSize: number;
    total: number;
  }

  // Current User
  interface CurrentUser {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'user' | 'guest';
    permissions?: string[];
  }

  // Login Params
  interface LoginParams {
    username: string;
    password: string;
    autoLogin?: boolean;
  }

  // Login Result
  interface LoginResult {
    status?: string;
    type?: string;
    currentAuthority?: string;
    token?: string;
    user?: CurrentUser;
  }

  // Subscription Types
  interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    period: 'monthly' | 'yearly';
    features: string[];
    maxDevices: number;
    maxStorage: string;
    supportLevel: string;
    popular: boolean;
    discount?: {
      percentage: number;
      expiresAt?: string;
    };
  }

  interface Subscription {
    id: string;
    planId: string;
    status: 'active' | 'cancelled' | 'past_due' | 'trialing';
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    trialEnd?: string;
    price: number;
    currency: string;
    billingCycleAnchor?: string;
    nextBillingDate?: string;
  }

  interface PaymentMethod {
    id: string;
    type: 'card' | 'google_pay' | 'apple_pay' | 'bank_transfer';
    brand?: string;
    last4?: string;
    expMonth?: number;
    expYear?: number;
    isDefault: boolean;
    created: string;
  }

  interface Invoice {
    id: string;
    number: string;
    amountDue: number;
    amountPaid: number;
    amountRemaining: number;
    currency: string;
    status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
    pdfUrl: string;
    hostedInvoiceUrl: string;
    created: string;
    periodStart: string;
    periodEnd: string;
    lines: InvoiceLine[];
  }

  interface InvoiceLine {
    id: string;
    description: string;
    amount: number;
    currency: string;
    quantity: number;
    period: {
      start: string;
      end: string;
    };
  }

  // Device Types
  interface Device {
    id: string;
    name: string;
    type: 'tablet' | 'kiosk' | 'pos' | 'display';
    status: 'online' | 'offline' | 'maintenance' | 'updating';
    location: string;
    ipAddress: string;
    macAddress: string;
    softwareVersion: string;
    lastActive: string;
    uptime: number;
    storage: {
      used: number;
      total: number;
      usagePercentage: number;
    };
    cpu: {
      usage: number;
      temperature?: number;
    };
    memory: {
      used: number;
      total: number;
      usagePercentage: number;
    };
    network: {
      ssid?: string;
      signalStrength?: number;
      downloadSpeed?: number;
      uploadSpeed?: number;
    };
    settings: {
      autoRestart: boolean;
      autoUpdate: boolean;
      screenTimeout: number;
      volume: number;
    };
  }

  // Business Types
  interface Business {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    taxId?: string;
    timezone: string;
    currency: string;
    createdAt: string;
    updatedAt: string;
  }

  // Usage Analytics
  interface UsageStats {
    period: {
      start: string;
      end: string;
    };
    devices: {
      active: number;
      total: number;
    };
    orders: {
      total: number;
      averageValue: number;
      peakHour: string;
    };
    storage: {
      used: number;
      total: number;
      files: number;
    };
    api: {
      calls: number;
      limit: number;
      mostUsedEndpoint: string;
    };
  }

  // Error Types
  interface ErrorInfo {
    success: boolean;
    data?: any;
    errorCode: string;
    errorMessage: string;
    showType: number;
    traceId: string;
    host: string;
  }

  // List Parameters
  interface ListParams {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: 'ascend' | 'descend';
    [key: string]: any;
  }

  // File Upload Response
  interface UploadResponse {
    url: string;
    name: string;
    size: number;
    type: string;
    uploadedAt: string;
  }

  // Notification
  interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    link?: string;
  }

  // System Status
  interface SystemStatus {
    overall: 'healthy' | 'degraded' | 'down';
    components: {
      api: 'up' | 'down' | 'slow';
      database: 'up' | 'down';
      payment: 'up' | 'down';
      storage: 'up' | 'down';
    };
    incidents: Array<{
      id: string;
      title: string;
      status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
      impact: 'minor' | 'major' | 'critical';
      startedAt: string;
      updatedAt: string;
    }>;
    metrics: {
      uptime: number;
      responseTime: number;
      errorRate: number;
    };
  }
}