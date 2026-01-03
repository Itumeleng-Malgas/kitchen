import { defineConfig } from '@umijs/max';
import routes from './routes';

export default defineConfig({
  antd: {},
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
});

