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
        path: '/account/settings',
        name: 'Settings',
        component: './Account/Settings',
        access: 'isOwner',
        icon: 'SettingOutlined',
      },
      {
        path: '/account/analytics',
        name: 'Analytics',
        component: './Account/Analytics',
        icon: 'RiseOutlined',
        wrappers: [
          '@/wrappers/planGuard',
        ],
        requiredPlan: 'PRO',
        access: 'isOwner',
      },
      // You can also have nested routes within nested routes
      {
        path: '/account/security',
        name: 'Security',
        icon: 'SafetyOutlined',
        component: './Account/Security/Password',
        routes: [
          {
            path: '/account/security/password',
            name: 'Change Password',
            component: './Account/Security/Password',
            access: 'isOwner',
          },
          {
            path: '/account/security/two-factor',
            name: 'Two-Factor Auth',
            component: './Account/Security/TwoFactor',
            wrappers: [
              '@/wrappers/planGuard',
            ],
            requiredPlan: 'PRO',
            access: 'isOwner',
          },
        ],
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
    path: '/kitchen',
    name: 'Kitchen',
    component: './Kitchen',
    icon: 'NumberOutlined', // Kitchen icon
    wrappers: ['@/wrappers/RootWrapper', '@/wrappers/planGuard'],
    requiredPlan: 'PRO',
    access: 'isKitchen',
  },
];
