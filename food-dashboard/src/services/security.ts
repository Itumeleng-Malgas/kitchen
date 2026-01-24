import { request } from '@umijs/max';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Enable2FARequest {
  type: 'authenticator' | 'sms' | 'email';
  phoneNumber?: string;
  email?: string;
  verificationCode: string;
}

export interface DeleteAccountRequest {
  email: string;
  password: string;
  confirm: boolean;
  reason?: string;
}

export interface SecurityEvent {
  id: string;
  type: string;
  description: string;
  ip: string;
  location: string;
  device: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export interface TwoFactorMethod {
  type: 'authenticator' | 'sms' | 'email' | 'backup';
  name: string;
  status: 'enabled' | 'disabled';
  lastUsed?: string;
}

export interface SecurityMetrics {
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  lastPasswordChange: string;
  twoFactorEnabled: boolean;
  activeSessions: number;
  suspiciousActivities: number;
}

// Change password
export async function changePassword(data: ChangePasswordRequest) {
  return request<API.Response<{ message: string }>>('/api/security/password/change', {
    method: 'POST',
    data,
  });
}

// Enable 2FA
export async function enableTwoFactor(data: Enable2FARequest) {
  return request<API.Response<{ 
    success: boolean;
    backupCodes?: string[];
    qrCode?: string;
    secret?: string;
  }>>('/api/security/2fa/enable', {
    method: 'POST',
    data,
  });
}

// Disable 2FA
export async function disableTwoFactor(verificationCode: string) {
  return request<API.Response<{ success: boolean }>>('/api/security/2fa/disable', {
    method: 'POST',
    data: { verificationCode },
  });
}

// Get 2FA methods
export async function getTwoFactorMethods() {
  return request<API.Response<TwoFactorMethod[]>>('/api/security/2fa/methods');
}

// Generate new backup codes
export async function generateBackupCodes(verificationCode: string) {
  return request<API.Response<{ backupCodes: string[] }>>('/api/security/2fa/backup-codes', {
    method: 'POST',
    data: { verificationCode },
  });
}

// Get active sessions
export async function getActiveSessions() {
  return request<API.Response<ActiveSession[]>>('/api/security/sessions');
}

// Terminate session
export async function terminateSession(sessionId: string) {
  return request<API.Response<{ success: boolean }>>(`/api/security/sessions/${sessionId}`, {
    method: 'DELETE',
  });
}

// Terminate all other sessions
export async function terminateAllOtherSessions() {
  return request<API.Response<{ terminated: number }>>('/api/security/sessions/others', {
    method: 'DELETE',
  });
}

// Get security events
export async function getSecurityEvents(params?: { 
  page?: number; 
  size?: number;
  type?: string;
  startDate?: string;
  endDate?: string;
}) {
  return request<API.Response<API.Page<SecurityEvent>>>('/api/security/events', {
    method: 'GET',
    params,
  });
}

// Get security metrics
export async function getSecurityMetrics() {
  return request<API.Response<SecurityMetrics>>('/api/security/metrics');
}

// Request account deletion
export async function deleteAccount(data: DeleteAccountRequest) {
  return request<API.Response<{ 
    success: boolean;
    deletionScheduled: string;
    confirmationRequired: boolean;
  }>>('/api/security/account/delete', {
    method: 'POST',
    data,
  });
}

// Cancel account deletion
export async function cancelAccountDeletion() {
  return request<API.Response<{ success: boolean }>>('/api/security/account/delete/cancel', {
    method: 'DELETE',
  });
}

// Export security data
export async function exportSecurityData(format: 'json' | 'csv' | 'pdf') {
  return request<Blob>('/api/security/export', {
    method: 'GET',
    params: { format },
    responseType: 'blob',
  });
}

// Update privacy settings
export async function updatePrivacySettings(data: {
  analytics: boolean;
  marketing: boolean;
  personalized: boolean;
  dataRetention: string;
}) {
  return request<API.Response<{ success: boolean }>>('/api/security/privacy', {
    method: 'PUT',
    data,
  });
}

// Get privacy settings
export async function getPrivacySettings() {
  return request<API.Response<any>>('/api/security/privacy');
}

// Get API keys
export async function getApiKeys() {
  return request<API.Response<any[]>>('/api/security/api-keys');
}

// Rotate API key
export async function rotateApiKey(keyId: string) {
  return request<API.Response<{ newKey: string }>>(`/api/security/api-keys/${keyId}/rotate`, {
    method: 'POST',
  });
}

// Revoke API key
export async function revokeApiKey(keyId: string) {
  return request<API.Response<{ success: boolean }>>(`/api/security/api-keys/${keyId}`, {
    method: 'DELETE',
  });
}