import { history, RuntimeConfig } from '@umijs/max';
import { mutate } from 'swr';

import { fetchCurrentUser } from '@/services/auth';
import { fetchSubscription } from '@/services/subscription';

export const getInitialState = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return {};
    }

    // Fetch from your FastAPI backend
    const [currentUser, subscription] = await Promise.all([
      fetchCurrentUser(),     // GET /auth/me
      fetchSubscription(),    // GET /subscription/current
    ]);

    // Optional: persist in localStorage for UI hints
    localStorage.setItem('PLAN', subscription.plan);
    localStorage.setItem('ROLE', currentUser.role);
    localStorage.setItem('RESTAURANT_ID', currentUser.restaurant_id || '');

    // Prime SWR cache (instant hydration)
    await mutate('/api/currentUser', currentUser, false);
    await mutate('/api/subscription', subscription, false);

    return {
      currentUser,
      subscription,
    };
  } catch (e) {
    localStorage.clear();
    history.push('/login');
    return {};
  }
};


export const request: RuntimeConfig['request'] = {
  timeout: 10000,
  errorConfig: {
    errorHandler(error: any) {
      // Unauthorized: clear session and redirect
      if (error?.response?.status === 401) {
        localStorage.clear();
        history.push('/login');
      }
      throw error;
    },
  },
  requestInterceptors: [
    (url: string, options: any) => {
      const token = localStorage.getItem('token');
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return { url, options };
    },
  ],
};

export const layout = () => {
  return {
    logo: '/logo.svg',
    title: 'Food Ordering Dashboard',
    layout: 'mix', // better UX than pure top
    contentStyle: { padding: 24 },
    headerHeight: 64,
    siderWidth: 220,

    onMenuHeaderClick: () => history.push('/'),
  };
};


