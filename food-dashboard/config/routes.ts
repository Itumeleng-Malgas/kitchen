export default [
  {
    path: '/login',
    layout: false,
    component: './Login',
  },
  {
    path: '/',
    name: 'Dashboard',
    component: './Dashboard',
    //access: 'isOwner',
    icon: 'DashboardOutlined', // Ant Design dashboard icon
  },
  {
    path: '/orders',
    name: 'Orders',
    component: './Orders',
    access: 'hasPro',
    icon: 'ShoppingCartOutlined', // Orders / shopping
  },
  {
    path: '/kitchen',
    name: 'Kitchen',
    component: './Kitchen',
    //access: 'isKitchen',
    icon: 'NumberOutlined', // Kitchen icon
  },
  {
    path: '/rider',
    name: 'Rider',
    component: './Rider',
    //access: 'isRider',
    icon: 'CarOutlined', // Rider / delivery
  },
];
