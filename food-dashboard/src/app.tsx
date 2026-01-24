import { history, RuntimeConfig, useLocation, request as apiRequest, RunTimeLayoutConfig } from '@umijs/max';
import { mutate } from 'swr';

import { fetchCurrentUser } from '@/services/auth';

export const getInitialState = async () => {
  try {
    // Fetch from your FastAPI backend
    const [currentUser] = await Promise.all([
      fetchCurrentUser(),     // GET /auth/me
    ]);

    console.log("getInitialState -> currentUser", currentUser)

    // Prime SWR cache (instant hydration)
    await mutate('/api/currentUser', currentUser, false);
    history.push('/dashboard')
    
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

      // Check if the URL is a public endpoint (doesn't require auth)
      const isPublic = url ? PUBLIC_PATHS.some(p =>
        url.startsWith(`/api${p}`)
      ) : false;

        console.log('🚨 Request error:', {
          status,
          url,
          isPublic,
          currentPath: location.pathname,
          hasCookie: document.cookie.includes('access_token') // Check if cookie exists
        });

      // If unauthorized on a protected endpoint and not already on login page
      if (status === 401 && !isPublic && location.pathname !== '/login') {
        localStorage.removeItem('rememberedEmail');
        window.location.href = '/login';
      }

      throw error;
    },
  },

  requestInterceptors: [
    (url: string, options: any) => {
      // Add credentials to ALL requests for cookie-based authentication
      options.credentials = 'include';
      
      return { url, options };
    },
  ],
};


import LogoutButton from '@/components/LogoutButton';
import DashboardFooter from './components/DashboardFooter';

export const layout: RunTimeLayoutConfig = (initialState) => {
  
  return {
    title: 'nQue Technologies',
    logo: 'logo.svg',
    layout: 'top',
    rightContentRender: (props) => <LogoutButton collapsed={props.collapsed} />,
    footerRender: () => <DashboardFooter/>,
    menuHeaderRender: undefined,
  };
};


