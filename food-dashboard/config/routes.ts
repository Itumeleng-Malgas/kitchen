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
    icon: 'DashboardOutlined',
    wrappers: ['@/wrappers/RootWrapper'],
  },
  {
    path: '/account',
    name: 'Account',
    access: 'isOwner',
    icon: 'UserOutlined',
    routes: [
      {
        path: '/account',
        redirect: '/account/profile',
        exact: true,
      },
      {
        path: '/account/profile',
        name: 'Profile',
        component: './Account/Profile',
        access: 'isOwner',
        icon: 'ProfileOutlined',
      },
      {
        path: '/account/analytics',
        name: 'Analytics',
        component: './Account/Analytics',
        icon: 'RiseOutlined',
        wrappers: [
          '@/wrappers/planGuard',
        ],
        //requiredPlan: 'PRO',
        access: 'isOwner',
      },
      {
        path: '/account/security',
        name: 'Security',
        icon: 'SafetyOutlined',
        component: './Account/Security'
      },
    ],
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
    path: '/subscription',
    component: './Subscription',
  },
];
