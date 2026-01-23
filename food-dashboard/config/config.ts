import { defineConfig } from '@umijs/max';
import routes from './routes';

export default defineConfig({
  //plugins: ['@umijs/plugin-locale'],
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
  layout: {},
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

