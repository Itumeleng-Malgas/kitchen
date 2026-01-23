import { request } from '@umijs/max';

// Get all devices
export async function getDevices(params?: API.ListParams) {
  return request<API.Response<API.Page<API.Device>>>('/api/devices', {
    method: 'GET',
    params,
  });
}

// Get device by ID
export async function getDevice(deviceId: string) {
  return request<API.Response<API.Device>>(`/api/devices/${deviceId}`, {
    method: 'GET',
  });
}

// Add new device
export async function addDevice(params: {
  name: string;
  type: API.Device['type'];
  location: string;
  settings?: Partial<API.Device['settings']>;
}) {
  return request<API.Response<API.Device>>('/api/devices', {
    method: 'POST',
    data: params,
  });
}

// Update device
export async function updateDevice(
  deviceId: string,
  params: Partial<API.Device>
) {
  return request<API.Response<API.Device>>(`/api/devices/${deviceId}`, {
    method: 'PUT',
    data: params,
  });
}

// Delete device
export async function deleteDevice(deviceId: string) {
  return request<API.Response<{ success: boolean }>>(`/api/devices/${deviceId}`, {
    method: 'DELETE',
  });
}

// Restart device
export async function restartDevice(deviceId: string) {
  return request<API.Response<{ success: boolean }>>(`/api/devices/${deviceId}/restart`, {
    method: 'POST',
  });
}

// Update device software
export async function updateDeviceSoftware(deviceId: string, version?: string) {
  return request<API.Response<{ success: boolean }>>(`/api/devices/${deviceId}/update`, {
    method: 'POST',
    data: { version },
  });
}

// Get device metrics
export async function getDeviceMetrics(deviceId: string, params?: {
  period?: string;
  metric?: 'cpu' | 'memory' | 'storage' | 'network';
}) {
  return request<API.Response<any>>(`/api/devices/${deviceId}/metrics`, {
    method: 'GET',
    params,
  });
}

// Bulk device operations
export async function bulkDeviceOperation(params: {
  deviceIds: string[];
  operation: 'restart' | 'update' | 'enable' | 'disable';
}) {
  return request<API.Response<{ success: boolean; results: any[] }>>('/api/devices/bulk', {
    method: 'POST',
    data: params,
  });
}