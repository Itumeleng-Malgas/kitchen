export default [
  {
    path: '/register',
    layout: false,
    component: './Register',
    wrappers: ['@/wrappers/RootWrapper'],
  },
  {
    path: '/login',
    layout: false,
    component: './Login',
    wrappers: ['@/wrappers/RootWrapper'],
  },
  {
    path: '/',
    exact: true,
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: './Dashboard',
    access: 'isOwner',
    icon: 'DashboardOutlined', // Ant Design dashboard icon
    wrappers: ['@/wrappers/RootWrapper'],
  },
  {
    path: '/orders',
    name: 'Orders',
    component: './Orders',
    access: 'isOwner',
    icon: 'ShoppingCartOutlined', // Orders / shopping
    wrappers: ['@/wrappers/RootWrapper'],
  },
  {
    path: '/kitchen',
    name: 'Kitchen',
    component: './Kitchen',
    icon: 'NumberOutlined', // Kitchen icon
    wrappers: ['@/wrappers/RootWrapper', '@/wrappers/planGuard'],
    requiredPlan: 'PRO',
    access: 'isKitchen',
  },
  {
  path: '/analytics',
  name: 'Analytics',
  component: './Analytics',
  icon: 'RiseOutlined',
  wrappers: [
    '@/wrappers/RootWrapper',
    '@/wrappers/planGuard',
  ],
  requiredPlan: 'PRO',
  access: 'atLeastPro',
}
];
