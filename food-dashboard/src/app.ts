import { history, RuntimeConfig, useLocation } from '@umijs/max';
import { mutate } from 'swr';

import { fetchCurrentUser } from '@/services/auth';

export const getInitialState = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return {};
    }

    // Fetch from your FastAPI backend
    const [currentUser] = await Promise.all([
      fetchCurrentUser(),     // GET /auth/me
    ]);

    // Optional: persist in localStorage for UI hints
    localStorage.setItem('PLAN', currentUser.plan);
    localStorage.setItem('ROLE', currentUser.role);
    localStorage.setItem('RESTAURANT_ID', currentUser.restaurant_id || '');

    // Prime SWR cache (instant hydration)
    await mutate('/api/currentUser', currentUser, false);

    return { currentUser };
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

      const isPublic = PUBLIC_PATHS.some(p =>
        url ? new URL(url, location.origin).pathname.startsWith(p) : false
      );

      if (status === 401 && !isPublic && location.pathname !== '/login') {
        localStorage.clear();
        window.location.href = '/login';
      }

      throw error;
    },
  },

  requestInterceptors: [
    (url: string, options: any) => {
      const isPublic = PUBLIC_PATHS.some(p =>
        new URL(url, location.origin).pathname.startsWith(p)
      );

      if (!isPublic && typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          };
        }
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


