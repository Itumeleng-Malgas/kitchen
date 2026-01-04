import { history, RuntimeConfig, useLocation } from '@umijs/max';
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

const PUBLIC_PATHS = ['/auth/login', '/auth/register'];
export const request: RuntimeConfig['request'] = {
  timeout: 10000,

  errorConfig: {
    errorHandler(error: any) {
      const status = error?.response?.status;
      const url = error?.response?.config?.url;

      // 401 handling: only for protected routes
      if (status === 401 && !PUBLIC_PATHS.some(p => url?.includes(p))) {
        localStorage.clear();
        history.push('/login');
      }

      throw error;
    },
  },

  requestInterceptors: [
    (url: string, options: any) => {
      // Do NOT attach token to public endpoints
      if (PUBLIC_PATHS.some(p => url.includes(p))) {
        return { url, options };
      }

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

export const layout = ({ initialState }: any) => {
  const location = useLocation();

  return {
    logo: '/logo.svg',
    title: 'Food Ordering Dashboard',
    layout: 'mix',
    contentStyle: { padding: 24 },
    headerHeight: 64,
    siderWidth: 220,

    onMenuHeaderClick: () => history.push('/'),

    onPageChange: () => {
      const token = localStorage.getItem('token');
       
      // Not logged in → force login
      if (!token && location.pathname !== '/login') {
        history.push('/login');
      }

      // Logged in → block login page
      if (token && location.pathname === '/login') {
        history.push('/');
      }
    },
  };
};


