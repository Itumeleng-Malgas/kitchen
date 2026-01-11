import { defineConfig } from '@umijs/max';
import routes from './routes';

export default defineConfig({
  antd: {
    theme: {
      token: {
        colorPrimary: '#822c6aff',
        borderRadius: 6,
      },
    },
  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'Food Dashboard',
  },
  locale: {
    default: 'en-US',
    antd: true,
    baseNavigator: true,
  },
  routes: routes,
  npmClient: 'npm',

  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
});

