import { useState, useCallback } from 'react';
import { useRequest } from 'ahooks';
import * as subscriptionService from '@/services/subscription';
import { message } from 'antd';

export default function useSubscriptionModel() {
  const [currentPlan, setCurrentPlan] = useState<string>('Professional');
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
    ]);
  }, [refreshPlans, refreshSubscription ]);

  return {
    // State
    currentPlan,
    loading: loading || loadingPlans || loadingSubscription,
    
    // Data
    plans: plans?.data,
    subscription: subscription?.data,
    
    // Actions
    updateSubscription,
    cancelSubscription,
    
    // Refresh functions
    refreshPlans,
    refreshSubscription,
    refreshAll,
  };
}