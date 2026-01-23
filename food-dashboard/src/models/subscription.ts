import { useState, useCallback } from 'react';
import { useRequest } from 'ahooks';
import * as subscriptionService from '@/services/subscription';
import * as deviceService from '@/services/device';
import { message } from 'antd';

export default function useSubscriptionModel() {
  const [currentPlan, setCurrentPlan] = useState<string>('professional');
  const [loading, setLoading] = useState(false);

  // Get subscription plans
  const { data: plans, loading: loadingPlans, run: refreshPlans } = useRequest(
    subscriptionService.getSubscriptionPlans,
  );

  // Get current subscription
  const { data: subscription, loading: loadingSubscription, run: refreshSubscription } = useRequest(
    subscriptionService.getCurrentSubscription,
    {
      onSuccess: (data) => {
        if (data?.data?.planId) {
          setCurrentPlan(data.data.planId);
        }
      },
      onError: (error) => {
        message.error('Failed to load subscription details');
      },
    },
  );

  // Get devices
  const { 
    data: devices, 
    loading: loadingDevices,
    run: refreshDevices,
    mutate: setDevices,
  } = useRequest(
    deviceService.getDevices,
    {
      onError: (error) => {
        message.error('Failed to load devices');
      },
    },
  );

  // Update subscription
  const updateSubscription = useCallback(async (params: {
    planId: string;
    paymentMethodId?: string;
  }) => {
    setLoading(true);
    try {
      const result = await subscriptionService.updateSubscription(params);
      if (result.success) {
        setCurrentPlan(params.planId);
        message.success('Subscription updated successfully');
        // Refresh subscription data
        await refreshSubscription();
        return result;
      } else {
        message.error(result.errorMessage || 'Failed to update subscription');
        return result;
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to update subscription');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshSubscription]);

  // Add device
  const addDevice = useCallback(async (params: any) => {
    setLoading(true);
    try {
      const result = await deviceService.addDevice(params);
      if (result.success) {
        message.success('Device added successfully');
        // Refresh devices
        await refreshDevices();
        return result;
      } else {
        message.error(result.errorMessage || 'Failed to add device');
        return result;
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to add device');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshDevices]);

  // Update device
  const updateDevice = useCallback(async (deviceId: string, params: any) => {
    setLoading(true);
    try {
      const result = await deviceService.updateDevice(deviceId, params);
      if (result.success) {
        message.success('Device updated successfully');
        // Update local state optimistically
        if (devices?.data?.list) {
          const updatedList = devices.data.list.map(device =>
            device.id === deviceId ? { ...device, ...params } : device
          );
          setDevices({
            ...devices,
            data: {
              ...devices.data,
              list: updatedList,
            },
          });
        }
        return result;
      } else {
        message.error(result.errorMessage || 'Failed to update device');
        return result;
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to update device');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [devices, setDevices]);

  // Delete device
  const deleteDevice = useCallback(async (deviceId: string) => {
    setLoading(true);
    try {
      const result = await deviceService.deleteDevice(deviceId);
      if (result.success) {
        message.success('Device deleted successfully');
        // Update local state optimistically
        if (devices?.data?.list) {
          const updatedList = devices.data.list.filter(device => device.id !== deviceId);
          setDevices({
            ...devices,
            data: {
              ...devices.data,
              list: updatedList,
            },
          });
        }
        return result;
      } else {
        message.error(result.errorMessage || 'Failed to delete device');
        return result;
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to delete device');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [devices, setDevices]);

  // Restart device
  const restartDevice = useCallback(async (deviceId: string) => {
    setLoading(true);
    try {
      const result = await deviceService.restartDevice(deviceId);
      if (result.success) {
        message.success('Device restart initiated');
        return result;
      } else {
        message.error(result.errorMessage || 'Failed to restart device');
        return result;
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to restart device');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel subscription
  const cancelSubscription = useCallback(async (params?: {
    cancelAtPeriodEnd?: boolean;
  }) => {
    setLoading(true);
    try {
      const result = await subscriptionService.cancelSubscription(params);
      if (result.success) {
        message.success('Subscription cancelled successfully');
        await refreshSubscription();
        return result;
      } else {
        message.error(result.errorMessage || 'Failed to cancel subscription');
        return result;
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to cancel subscription');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshSubscription]);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshPlans(),
      refreshSubscription(),
      refreshDevices(),
    ]);
  }, [refreshPlans, refreshSubscription, refreshDevices]);

  return {
    // State
    currentPlan,
    loading: loading || loadingPlans || loadingSubscription || loadingDevices,
    
    // Data
    plans: plans?.data,
    subscription: subscription?.data,
    devices: devices?.data?.list || [],
    pagination: devices?.data,
    
    // Actions
    updateSubscription,
    cancelSubscription,
    addDevice,
    updateDevice,
    deleteDevice,
    restartDevice,
    
    // Refresh functions
    refreshPlans,
    refreshSubscription,
    refreshDevices,
    refreshAll,
  };
}