import React, { useState } from 'react';
import PageContainer from '@/components/PageContainer';
import {
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  EyeOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserAddOutlined,
  ShoppingOutlined,
  BellOutlined,
  SyncOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import {
  ProCard,
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
  ProFormDigit,
  ProFormTextArea,
  ProTable,
  StatisticCard,
} from '@ant-design/pro-components';
import {
  Button,
  Dropdown,
  Space,
  Tag,
  Statistic,
  Alert,
  Row,
  Col,
  Avatar,
  Badge,
  Tabs,
  Typography,
  Divider,
  Modal,
  message,
  Upload,
  Tooltip,
  Switch,
  Progress,
  Card,
  List,
  MenuProps,
} from 'antd';
import { useNavigate, useRequest } from '@umijs/max';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
//const { Statistic: AntdStatistic } = Statistic;

interface BusinessInfo {
  id: string;
  name: string;
  type: 'restaurant' | 'cafe' | 'retail' | 'service';
  status: 'active' | 'inactive' | 'pending';
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  timezone: string;
  currency: string;
  taxId?: string;
  registrationDate: string;
  logo?: string;
  description: string;
}

interface SubscriptionInfo {
  plan: string;
  status: 'active' | 'cancelled' | 'past_due';
  price: number;
  nextBilling: string;
  maxUsers: number;
  maxProducts: number;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'out_of_stock' | 'draft';
  sales: number;
  revenue: number;
  lastUpdated: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive';
  lastLogin: string;
  permissions: string[];
}

const BusinessProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('base');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const navigate = useNavigate();

  // Fetch business data
  const { data: businessData, loading: loadingBusiness, run: refreshBusiness } = useRequest<API.Response<BusinessInfo>>(
    '/api/business/profile'
  );

  const { data: subscriptionData } = useRequest<API.Response<SubscriptionInfo>>(
    '/api/business/subscription'
  );

  const { data: productsData, loading: loadingProducts } = useRequest<API.Response<API.Page<Product>>>(
    '/api/products',
    {
      defaultParams: [{ pageSize: 10, current: 1 }],
    }
  );

  const { data: usersData, loading: loadingUsers } = useRequest<API.Response<API.Page<User>>>(
    '/api/users',
    {
      defaultParams: [{ pageSize: 10, current: 1 }],
    }
  );

  const { data: statsData } = useRequest('/api/business/stats');

  // Mock data
  const mockBusiness: BusinessInfo = {
    id: 'BUS-2024-001',
    name: 'Tasty Bites Restaurant',
    type: 'restaurant',
    status: 'active',
    email: 'contact@tastybites.com',
    phone: '+1 (555) 123-4567',
    website: 'https://tastybites.com',
    address: '123 Food Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    timezone: 'America/New_York',
    currency: 'USD',
    taxId: 'TAX-789456123',
    registrationDate: '2024-01-15',
    logo: '/logo.png',
    description: 'A premium restaurant offering delicious meals with quick WhatsApp ordering.',
  };

  const mockSubscription: SubscriptionInfo = {
    plan: 'PRO',
    status: 'active',
    price: 99,
    nextBilling: '2024-02-15',
    maxUsers: 10,
    maxProducts: 500,
  };

  const mockStats = {
    totalRevenue: 24580,
    totalOrders: 1245,
    activeUsers: 8,
    activeProducts: 156,
    monthlyGrowth: 12.5,
    customerSatisfaction: 4.7,
  };

  const mockProducts: Product[] = [
    { id: 'P001', name: 'Classic Burger', category: 'Mains', price: 12.99, stock: 45, status: 'active', sales: 345, revenue: 4476.55, lastUpdated: '2024-01-20' },
    { id: 'P002', name: 'Caesar Salad', category: 'Salads', price: 8.99, stock: 32, status: 'active', sales: 289, revenue: 2598.11, lastUpdated: '2024-01-20' },
    { id: 'P003', name: 'Margherita Pizza', category: 'Mains', price: 14.99, stock: 28, status: 'active', sales: 267, revenue: 4002.33, lastUpdated: '2024-01-19' },
    { id: 'P004', name: 'French Fries', category: 'Sides', price: 4.99, stock: 12, status: 'out_of_stock', sales: 412, revenue: 2055.88, lastUpdated: '2024-01-18' },
    { id: 'P005', name: 'Coca-Cola', category: 'Drinks', price: 2.99, stock: 156, status: 'active', sales: 567, revenue: 1695.33, lastUpdated: '2024-01-20' },
    { id: 'P006', name: 'Chocolate Cake', category: 'Desserts', price: 6.99, stock: 8, status: 'active', sales: 156, revenue: 1090.44, lastUpdated: '2024-01-19' },
    { id: 'P007', name: 'Chicken Wings', category: 'Appetizers', price: 11.99, stock: 23, status: 'active', sales: 198, revenue: 2374.02, lastUpdated: '2024-01-17' },
    { id: 'P008', name: 'Coffee', category: 'Drinks', price: 3.99, stock: 89, status: 'active', sales: 423, revenue: 1687.77, lastUpdated: '2024-01-20' },
  ];

  const mockUsers: User[] = [
    { id: 'U001', name: 'John Smith', email: 'john@tastybites.com', role: 'admin', status: 'active', lastLogin: '2024-01-20 14:30', permissions: ['all'] },
    { id: 'U002', name: 'Maria Garcia', email: 'maria@tastybites.com', role: 'manager', status: 'active', lastLogin: '2024-01-20 10:15', permissions: ['orders', 'products', 'customers'] },
    { id: 'U003', name: 'Robert Johnson', email: 'robert@tastybites.com', role: 'staff', status: 'active', lastLogin: '2024-01-19 16:45', permissions: ['orders', 'products'] },
    { id: 'U004', name: 'Sarah Williams', email: 'sarah@tastybites.com', role: 'staff', status: 'inactive', lastLogin: '2024-01-15 09:20', permissions: ['orders'] },
    { id: 'U005', name: 'Michael Brown', email: 'michael@tastybites.com', role: 'manager', status: 'active', lastLogin: '2024-01-20 11:45', permissions: ['orders', 'products', 'analytics'] },
  ];

  const handleEditBusiness = async (values: any) => {
    try {
      // API call to update business
      await fetch('/api/business/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      message.success('Business profile updated successfully');
      setEditModalVisible(false);
      refreshBusiness();
    } catch (error) {
      message.error('Failed to update business profile');
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    // Open product modal
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    // Open product modal
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    // Open user modal
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    // Open user modal
  };

  const handleMoreMenuClick: MenuProps['onClick'] = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  };

  const moreMenuItems: MenuProps = {
  items: [
    {
      key: 'subscription',
      label: 'Manage Subscription',
      icon: <PlusOutlined />,
    },
    {
      key: 'analytics',
      label: 'View Analytics',
      icon: <BarChartOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      label: 'Security Settings',
      icon: <SettingOutlined />,
    },
  ],
  onClick: ({ key }) => {
    console.log('Clicked key:', key);
    // Handle export logic based on key
    switch (key) {
      case 'subscription':
        navigate('/subscription');
        break;
      case 'analytics':
        navigate('/account/analytics');
        break;
      case 'settings':
        navigate('/account/security');
        break;
    }
  },
};

  return (
    <PageContainer
      fullHeight
      header={{
        title: 'Business Profile',
        subTitle: 'Manage your business settings and configuration',
        ghost: true,
        breadcrumb: {
          routes: [
            { path: '/', breadcrumbName: 'Home' },
            { path: '/business', breadcrumbName: 'Business' },
            { path: '/business/profile', breadcrumbName: 'Profile' },
          ],
        },
        extra: [
          <Button 
            key="edit" 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => setEditModalVisible(true)}
          >
            Edit Profile
          </Button>,
          <Dropdown
            key="more"
            menu={moreMenuItems}
            placement="bottomRight"
          >
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>,
        ],
      }}
      tabBarExtraContent={
        <Space>
          <Tag color="green">Active</Tag>
          <Text type="secondary">Since {moment(mockBusiness.registrationDate).format('MMM D, YYYY')}</Text>
        </Space>
      }
      tabList={[
        {
          tab: 'Overview',
          key: 'base',
          closable: false,
        },
        {
          tab: 'Subscription',
          key: 'subs',
        },
        {
          tab: 'Products',
          key: 'products',
          closable: false,
        },
        {
          tab: 'Team',
          key: 'team',
          closable: false,
        },
        {
          tab: 'Settings',
          key: 'settings',
        },
      ]}
      tabActiveKey={activeTab}
      onTabChange={setActiveTab}
      ghost
      content={
        <Alert
          message={
            <Space>
              <BellOutlined />
              <span>Your subscription renews on {moment(mockSubscription.nextBilling).format('MMMM D, YYYY')}</span>
            </Space>
          }
          type="info"
          showIcon
          closable
          action={
            <Button size="small" type="link">
              View Details
            </Button>
          }
        />
      }
    >
      {activeTab === 'base' && (
        <ProCard direction="column" ghost gutter={[0, 16]}>
          {/* Business Overview */}
          <ProCard
            title="Business Overview"
            extra={
              <Button 
                type="link" 
                icon={<SyncOutlined />}
                onClick={() => refreshBusiness()}
                loading={loadingBusiness}
              >
                Refresh
              </Button>
            }
            headerBordered
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <ProCard
                  colSpan={24}
                  style={{ textAlign: 'center', padding: 24 }}
                >
                  <Avatar
                    size={120}
                    src={mockBusiness.logo}
                    style={{ marginBottom: 16 }}
                  >
                    {mockBusiness.name.charAt(0)}
                  </Avatar>
                  <Title level={3} style={{ marginBottom: 8 }}>
                    {mockBusiness.name}
                  </Title>
                  <Tag color="blue" style={{ marginBottom: 16 }}>
                    {mockBusiness.type.toUpperCase()}
                  </Tag>
                  <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                    {mockBusiness.description}
                  </Paragraph>
                </ProCard>
              </Col>
              
              <Col xs={24} md={16}>
                <Row gutter={[16, 16]}>
                  {/* Key Stats */}
                  {[
                    { title: 'Total Revenue', value: `$${mockStats.totalRevenue.toLocaleString()}`, change: '+12.5%', color: '#52c41a' },
                    { title: 'Total Orders', value: mockStats.totalOrders.toLocaleString(), change: '+8.3%', color: '#1890ff' },
                    { title: 'Active Users', value: `${mockStats.activeUsers}/${mockSubscription.maxUsers}`, change: '2 new', color: '#722ed1' },
                    { title: 'Active Products', value: `${mockStats.activeProducts}/${mockSubscription.maxProducts}`, change: '+5.2%', color: '#fa8c16' },
                  ].map((stat, index) => (
                    <Col key={index} xs={24} sm={12}>
                      <ProCard hoverable>
                        <Statistic
                          title={stat.title}
                          value={stat.value}
                          valueStyle={{ color: stat.color, fontSize: 24 }}
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                          <Space>
                            <Text type="secondary">{stat.change}</Text>
                            <Text type="secondary">this month</Text>
                          </Space>
                        </div>
                      </ProCard>
                    </Col>
                  ))}
                </Row>
                
                <Divider />
                
                {/* Quick Info */}
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <List size="small">
                      <List.Item>
                        <List.Item.Meta
                          title="Business ID"
                          description={mockBusiness.id}
                        />
                      </List.Item>
                      <List.Item>
                        <List.Item.Meta
                          title="Email"
                          description={mockBusiness.email}
                        />
                      </List.Item>
                      <List.Item>
                        <List.Item.Meta
                          title="Phone"
                          description={mockBusiness.phone}
                        />
                      </List.Item>
                    </List>
                  </Col>
                  <Col span={12}>
                    <List size="small">
                      <List.Item>
                        <List.Item.Meta
                          title="Address"
                          description={`${mockBusiness.address}, ${mockBusiness.city}, ${mockBusiness.state} ${mockBusiness.zipCode}`}
                        />
                      </List.Item>
                      <List.Item>
                        <List.Item.Meta
                          title="Timezone"
                          description={mockBusiness.timezone}
                        />
                      </List.Item>
                      <List.Item>
                        <List.Item.Meta
                          title="Currency"
                          description={mockBusiness.currency}
                        />
                      </List.Item>
                    </List>
                  </Col>
                </Row>
              </Col>
            </Row>
          </ProCard>
        </ProCard>
      )}

      {activeTab === 'subs' && (
        <ProCard title="Subscription Details" headerBordered>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <ProCard>
                <StatisticCard
                  title="Current Plan"
                  statistic={{
                    title: mockSubscription.plan,
                    value: `$${mockSubscription.price}`,
                    suffix: '/month',
                    description: (
                      <Space direction="vertical" size="small">
                        <Tag color="green">Active</Tag>
                        <Text type="secondary">
                          Next billing: {moment(mockSubscription.nextBilling).format('MMMM D, YYYY')}
                        </Text>
                      </Space>
                    ),
                  }}
                  chart={
                    <div style={{ textAlign: 'center', padding: 24 }}>
                      <Progress
                        type="circle"
                        percent={85}
                        strokeColor={{
                          '0%': '#108ee9',
                          '100%': '#87d068',
                        }}
                        format={(percent) => `${percent}% Utilized`}
                      />
                    </div>
                  }
                />
              </ProCard>
            </Col>
            
            <Col xs={24} lg={8}>
              <ProCard title="Plan Features" headerBordered>
                <List
                  dataSource={[
                    `Up to ${mockSubscription.maxUsers} team members`,
                    `Up to ${mockSubscription.maxProducts} products`,
                    'Unlimited WhatsApp orders',
                    'Priority support',
                    'Advanced analytics',
                    'API access',
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <Space>
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        <Text>{item}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </ProCard>
            </Col>
          </Row>
        </ProCard>
      )}

      {activeTab === 'products' && (
        <ProCard direction="column" ghost gutter={[0, 16]}>
          <ProCard
            title="Products Management"
            extra={
              <Space>
                <Button icon={<DownloadOutlined />}>Export</Button>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleAddProduct}
                >
                  Add Product
                </Button>
              </Space>
            }
            headerBordered
          >
            <ProTable<Product>
              columns={[
                {
                  title: 'Product',
                  dataIndex: 'name',
                  width: 200,
                  render: (text, record) => (
                    <Space>
                      <Avatar size="small" shape="square">
                        {text.charAt(0)}
                      </Avatar>
                      <div>
                        <Text strong>{text}</Text>
                        <div style={{ fontSize: 12, color: '#666' }}>
                          {record.category}
                        </div>
                      </div>
                    </Space>
                  ),
                },
                {
                  title: 'Price',
                  dataIndex: 'price',
                  width: 100,
                  render: (text) => `$${text.toFixed(2)}`,
                  sorter: (a, b) => a.price - b.price,
                },
                {
                  title: 'Stock',
                  dataIndex: 'stock',
                  width: 120,
                  render: (text, record) => (
                    <div>
                      <Progress
                        percent={Math.min((text / 100) * 100, 100)}
                        size="small"
                        status={record.status === 'out_of_stock' ? 'exception' : 'normal'}
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {text} units
                      </Text>
                    </div>
                  ),
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  width: 100,
                  render: (text) => (
                    <Tag color={text === 'active' ? 'success' : text === 'out_of_stock' ? 'error' : 'default'}>
                      {text.replace('_', ' ').toUpperCase()}
                    </Tag>
                  ),
                },
                {
                  title: 'Sales',
                  dataIndex: 'sales',
                  width: 100,
                  sorter: (a, b) => a.sales - b.sales,
                  render: (text) => text.toLocaleString(),
                },
                {
                  title: 'Revenue',
                  dataIndex: 'revenue',
                  width: 120,
                  render: (text) => `$${text.toLocaleString()}`,
                  sorter: (a, b) => a.revenue - b.revenue,
                },
                {
                  title: 'Last Updated',
                  dataIndex: 'lastUpdated',
                  width: 120,
                  render: (text) => moment(text).fromNow(),
                },
                {
                  title: 'Actions',
                  width: 120,
                  render: (_, record) => (
                    <Space>
                      <Button
                        type="link"
                        size="small"
                        onClick={() => handleEditProduct(record)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        danger
                      >
                        Delete
                      </Button>
                    </Space>
                  ),
                },
              ]}
              dataSource={mockProducts}
              rowKey="id"
              loading={loadingProducts}
              search={{
                labelWidth: 'auto',
              }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
              }}
              toolBarRender={false}
            />
          </ProCard>
        </ProCard>
      )}

      {activeTab === 'team' && (
        <ProCard direction="column" ghost gutter={[0, 16]}>
          <ProCard
            title="Team Management"
            extra={
              <Space>
                <Button icon={<DownloadOutlined />}>Export</Button>
                <Button 
                  type="primary" 
                  icon={<UserAddOutlined />}
                  onClick={handleAddUser}
                >
                  Invite Member
                </Button>
              </Space>
            }
            headerBordered
          >
            <ProTable<User>
              columns={[
                {
                  title: 'Team Member',
                  dataIndex: 'name',
                  width: 200,
                  render: (text, record) => (
                    <Space>
                      <Avatar size="small">
                        {text.charAt(0)}
                      </Avatar>
                      <div>
                        <Text strong>{text}</Text>
                        <div style={{ fontSize: 12, color: '#666' }}>
                          {record.email}
                        </div>
                      </div>
                    </Space>
                  ),
                },
                {
                  title: 'Role',
                  dataIndex: 'role',
                  width: 100,
                  render: (text) => (
                    <Tag color={text === 'admin' ? 'red' : text === 'manager' ? 'blue' : 'green'}>
                      {text}
                    </Tag>
                  ),
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  width: 100,
                  render: (text) => (
                    <Badge
                      status={text === 'active' ? 'success' : 'error'}
                      text={text}
                    />
                  ),
                },
                {
                  title: 'Last Login',
                  dataIndex: 'lastLogin',
                  width: 140,
                  render: (text) => moment(text).fromNow(),
                },
                {
                  title: 'Permissions',
                  dataIndex: 'permissions',
                  width: 200,
                  render: (permissions: string[]) => (
                    <Space wrap>
                      {permissions.slice(0, 2).map((perm, index) => (
                        <Tag key={index} color="geekblue" size="small">
                          {perm}
                        </Tag>
                      ))}
                      {permissions.length > 2 && (
                        <Tag size="small">+{permissions.length - 2}</Tag>
                      )}
                    </Space>
                  ),
                },
                {
                  title: 'Actions',
                  width: 120,
                  render: (_, record) => (
                    <Space>
                      <Button
                        type="link"
                        size="small"
                        onClick={() => handleEditUser(record)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        danger
                      >
                        Remove
                      </Button>
                    </Space>
                  ),
                },
              ]}
              dataSource={mockUsers}
              rowKey="id"
              loading={loadingUsers}
              search={{
                labelWidth: 'auto',
              }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
              }}
              toolBarRender={false}
            />
          </ProCard>
        </ProCard>
      )}

      {activeTab === 'settings' && (
        <ProCard title="Business Settings" headerBordered>
          <Tabs type="card">
            <Tabs.TabPane tab="General Settings" key="general">
              <ProForm
                layout="vertical"
                onFinish={handleEditBusiness}
                initialValues={mockBusiness}
                submitter={{
                  render: (props, dom) => [
                    <Button key="cancel" onClick={() => setEditModalVisible(false)}>
                      Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => props.form?.submit?.()}>
                      Save Changes
                    </Button>,
                  ],
                }}
              >
                <ProFormText
                  name="name"
                  label="Business Name"
                  rules={[{ required: true }]}
                  placeholder="Enter business name"
                />
                <ProFormSelect
                  name="type"
                  label="Business Type"
                  options={[
                    { value: 'restaurant', label: 'Restaurant' },
                    { value: 'cafe', label: 'Cafe' },
                    { value: 'retail', label: 'Retail' },
                    { value: 'service', label: 'Service' },
                  ]}
                  rules={[{ required: true }]}
                />
                <ProFormTextArea
                  name="description"
                  label="Description"
                  placeholder="Describe your business"
                />
                <Row gutter={16}>
                  <Col span={12}>
                    <ProFormText
                      name="email"
                      label="Email"
                      rules={[{ required: true, type: 'email' }]}
                      placeholder="contact@business.com"
                    />
                  </Col>
                  <Col span={12}>
                    <ProFormText
                      name="phone"
                      label="Phone"
                      rules={[{ required: true }]}
                      placeholder="+1 (555) 123-4567"
                    />
                  </Col>
                </Row>
                <ProFormText
                  name="website"
                  label="Website"
                  placeholder="https://yourbusiness.com"
                />
              </ProForm>
            </Tabs.TabPane>
            
            <Tabs.TabPane tab="Location" key="location">
              <ProForm layout="vertical">
                <Row gutter={16}>
                  <Col span={24}>
                    <ProFormText
                      name="address"
                      label="Street Address"
                      placeholder="123 Main Street"
                    />
                  </Col>
                  <Col span={8}>
                    <ProFormText
                      name="city"
                      label="City"
                      placeholder="New York"
                    />
                  </Col>
                  <Col span={8}>
                    <ProFormText
                      name="state"
                      label="State/Province"
                      placeholder="NY"
                    />
                  </Col>
                  <Col span={8}>
                    <ProFormText
                      name="zipCode"
                      label="ZIP/Postal Code"
                      placeholder="10001"
                    />
                  </Col>
                </Row>
                <ProFormSelect
                  name="country"
                  label="Country"
                  options={[
                    { value: 'US', label: 'United States' },
                    { value: 'CA', label: 'Canada' },
                    { value: 'UK', label: 'United Kingdom' },
                    { value: 'AU', label: 'Australia' },
                  ]}
                />
                <ProFormSelect
                  name="timezone"
                  label="Timezone"
                  options={[
                    { value: 'America/New_York', label: 'Eastern Time (ET)' },
                    { value: 'America/Chicago', label: 'Central Time (CT)' },
                    { value: 'America/Denver', label: 'Mountain Time (MT)' },
                    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                  ]}
                />
              </ProForm>
            </Tabs.TabPane>
            
            <Tabs.TabPane tab="Notifications" key="notifications">
              <ProCard>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div>
                    <Title level={5}>Order Notifications</Title>
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <Space>
                          <Switch defaultChecked />
                          <Text>Email notifications for new orders</Text>
                        </Space>
                      </Col>
                      <Col span={24}>
                        <Space>
                          <Switch defaultChecked />
                          <Text>Push notifications for new orders</Text>
                        </Space>
                      </Col>
                      <Col span={24}>
                        <Space>
                          <Switch defaultChecked />
                          <Text>SMS notifications for high-value orders</Text>
                        </Space>
                      </Col>
                    </Row>
                  </div>
                  
                  <Divider />
                  
                  <div>
                    <Title level={5}>System Notifications</Title>
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <Space>
                          <Switch defaultChecked />
                          <Text>Low stock alerts</Text>
                        </Space>
                      </Col>
                      <Col span={24}>
                        <Space>
                          <Switch defaultChecked />
                          <Text>Subscription renewal reminders</Text>
                        </Space>
                      </Col>
                      <Col span={24}>
                        <Space>
                          <Switch />
                          <Text>Weekly performance reports</Text>
                        </Space>
                      </Col>
                    </Row>
                  </div>
                </Space>
              </ProCard>
            </Tabs.TabPane>
            
            <Tabs.TabPane tab="Integrations" key="integrations">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <ProCard
                    title="WhatsApp Business API"
                    extra={<Tag color="green">Connected</Tag>}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Text>Connected to: +1 (555) 123-4567</Text>
                      <Text type="secondary">Last synced: 2 minutes ago</Text>
                      <Button type="link">Configure WhatsApp Settings</Button>
                    </Space>
                  </ProCard>
                </Col>
                <Col span={24}>
                  <ProCard
                    title="Payment Gateway"
                    extra={<Tag color="blue">Stripe</Tag>}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Text>Connected to Stripe</Text>
                      <Text type="secondary">Account: acc_789456123</Text>
                      <Button type="link">View Payment Settings</Button>
                    </Space>
                  </ProCard>
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>
        </ProCard>
      )}

      {/* Edit Business Modal */}
      <Modal
        title="Edit Business Profile"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={800}
      >
        <ProForm
          layout="vertical"
          onFinish={handleEditBusiness}
          initialValues={mockBusiness}
          submitter={{
            render: (props, dom) => [
              <Button key="cancel" onClick={() => setEditModalVisible(false)}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={() => props.form?.submit?.()}>
                Save Changes
              </Button>,
            ],
          }}
        >
          <ProCard gutter={16}>
            <ProCard colSpan={12}>
              <ProFormText
                name="name"
                label="Business Name"
                rules={[{ required: true }]}
                placeholder="Enter business name"
              />
              <ProFormSelect
                name="type"
                label="Business Type"
                options={[
                  { value: 'restaurant', label: 'Restaurant' },
                  { value: 'cafe', label: 'Cafe' },
                  { value: 'retail', label: 'Retail' },
                  { value: 'service', label: 'Service' },
                ]}
                rules={[{ required: true }]}
              />
              <ProFormTextArea
                name="description"
                label="Description"
                placeholder="Describe your business"
              />
            </ProCard>
            <ProCard colSpan={12}>
              <ProFormText
                name="email"
                label="Email"
                rules={[{ required: true, type: 'email' }]}
                placeholder="contact@business.com"
              />
              <ProFormText
                name="phone"
                label="Phone"
                rules={[{ required: true }]}
                placeholder="+1 (555) 123-4567"
              />
              <ProFormText
                name="website"
                label="Website"
                placeholder="https://yourbusiness.com"
              />
            </ProCard>
          </ProCard>
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default BusinessProfilePage;