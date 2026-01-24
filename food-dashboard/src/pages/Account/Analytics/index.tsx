import React, { useState, useMemo } from 'react';
import {
  PageContainer,
  ProCard,
  ProTable,
  ProDescriptions,
} from '@ant-design/pro-components';
import {
  MessageOutlined,
  DollarOutlined,
  ShoppingOutlined,
  UserOutlined,
  ClockCircleOutlined,
  FireOutlined,
  RiseOutlined,
  FallOutlined,
  PieChartOutlined,
  CalendarOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  WhatsAppOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ShoppingCartOutlined,
  TagOutlined,
} from '@ant-design/icons';
import {
  Row,
  Col,
  Button,
  Tag,
  DatePicker,
  Select,
  Space,
  Statistic,
  Alert,
  Tabs,
  Progress,
  Badge,
  Tooltip,
  Dropdown,
  Menu,
  Radio,
  Typography,
  Avatar,
} from 'antd';
import { useRequest } from '@umijs/max';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Scatter,
} from 'recharts';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const { Text, Title } = Typography;

// Types
interface AnalyticsMetric {
  title: string;
  value: number | string;
  change: number;
  prefix?: React.ReactNode;
  suffix?: string;
  color?: string;
  format?: 'currency' | 'number' | 'percent' | 'time';
  description?: string;
}

interface OrderData {
  date: string;
  orders: number;
  revenue: number;
  avgOrderValue: number;
  completed: number;
  pending: number;
  cancelled: number;
}

interface HourlyData {
  hour: string;
  orders: number;
  messages: number;
  conversionRate: number;
}

interface TopCustomer {
  id: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  avgOrderValue: number;
  favoriteItems: string[];
}

interface TopItem {
  name: string;
  orders: number;
  revenue: number;
  category: string;
  popularity: number;
  margin: number;
}

interface OrderStatus {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

interface MessageMetrics {
  totalMessages: number;
  responseTime: number;
  customerSatisfaction: number;
  automationRate: number;
}

const AnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<any>([
    moment().subtract(30, 'days'),
    moment(),
  ]);
  const [timeRange, setTimeRange] = useState('30days');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const mockMetrics: AnalyticsMetric[] = [
    {
      title: 'Total Revenue',
      value: 24580,
      change: 12.5,
      prefix: <DollarOutlined />,
      suffix: 'USD',
      color: '#52c41a',
      format: 'currency',
      description: 'Total revenue from WhatsApp orders',
    },
    {
      title: 'Total Orders',
      value: 1245,
      change: 8.3,
      prefix: <ShoppingCartOutlined />,
      color: '#1890ff',
      format: 'number',
      description: 'Number of orders received via WhatsApp',
    },
    {
      title: 'Avg Order Value',
      value: 19.73,
      change: 3.2,
      prefix: <DollarOutlined />,
      suffix: 'USD',
      color: '#722ed1',
      format: 'currency',
      description: 'Average value per order',
    },
    {
      title: 'Active Customers',
      value: 892,
      change: 15.7,
      prefix: <UserOutlined />,
      color: '#fa8c16',
      format: 'number',
      description: 'Customers who ordered this period',
    },
    {
      title: 'Conversion Rate',
      value: 68,
      change: 5.2,
      prefix: <CheckCircleOutlined />,
      suffix: '%',
      color: '#13c2c2',
      format: 'percent',
      description: 'Message to order conversion',
    },
    {
      title: 'Avg Response Time',
      value: 2.4,
      change: -12.5,
      prefix: <ClockCircleOutlined />,
      suffix: 'min',
      color: '#f5222d',
      format: 'time',
      description: 'Average bot response time',
    },
  ];

  const mockOrderData: OrderData[] = Array.from({ length: 30 }, (_, i) => ({
    date: moment().subtract(29 - i, 'days').format('MMM DD'),
    orders: Math.floor(Math.random() * 60) + 20,
    revenue: Math.floor(Math.random() * 1000) + 500,
    avgOrderValue: Math.floor(Math.random() * 10) + 15,
    completed: Math.floor(Math.random() * 50) + 15,
    pending: Math.floor(Math.random() * 10) + 2,
    cancelled: Math.floor(Math.random() * 5) + 1,
  }));

  const mockHourlyData: HourlyData[] = [
    { hour: '8 AM', orders: 45, messages: 120, conversionRate: 37.5 },
    { hour: '9 AM', orders: 78, messages: 195, conversionRate: 40.0 },
    { hour: '10 AM', orders: 92, messages: 210, conversionRate: 43.8 },
    { hour: '11 AM', orders: 145, messages: 320, conversionRate: 45.3 },
    { hour: '12 PM', orders: 189, messages: 380, conversionRate: 49.7 },
    { hour: '1 PM', orders: 156, messages: 340, conversionRate: 45.9 },
    { hour: '2 PM', orders: 112, messages: 280, conversionRate: 40.0 },
    { hour: '3 PM', orders: 98, messages: 250, conversionRate: 39.2 },
    { hour: '4 PM', orders: 134, messages: 310, conversionRate: 43.2 },
    { hour: '5 PM', orders: 167, messages: 350, conversionRate: 47.7 },
    { hour: '6 PM', orders: 198, messages: 410, conversionRate: 48.3 },
    { hour: '7 PM', orders: 156, messages: 340, conversionRate: 45.9 },
    { hour: '8 PM', orders: 89, messages: 220, conversionRate: 40.5 },
  ];

  const mockTopCustomers: TopCustomer[] = [
    { id: 'C001', name: 'John Smith', phone: '+1 (555) 123-4567', totalOrders: 45, totalSpent: 1250, lastOrder: '2 hours ago', avgOrderValue: 27.78, favoriteItems: ['Burger', 'Fries', 'Coke'] },
    { id: 'C002', name: 'Maria Garcia', phone: '+1 (555) 234-5678', totalOrders: 38, totalSpent: 980, lastOrder: 'Yesterday', avgOrderValue: 25.79, favoriteItems: ['Pizza', 'Salad'] },
    { id: 'C003', name: 'Robert Johnson', phone: '+1 (555) 345-6789', totalOrders: 32, totalSpent: 820, lastOrder: '3 days ago', avgOrderValue: 25.63, favoriteItems: ['Chicken Wings', 'Beer'] },
    { id: 'C004', name: 'Sarah Williams', phone: '+1 (555) 456-7890', totalOrders: 28, totalSpent: 750, lastOrder: 'Today', avgOrderValue: 26.79, favoriteItems: ['Pasta', 'Wine'] },
    { id: 'C005', name: 'Michael Brown', phone: '+1 (555) 567-8901', totalOrders: 25, totalSpent: 680, lastOrder: '1 week ago', avgOrderValue: 27.20, favoriteItems: ['Steak', 'Mashed Potatoes'] },
  ];

  const mockTopItems: TopItem[] = [
    { name: 'Classic Burger', orders: 345, revenue: 6817.5, category: 'Mains', popularity: 95, margin: 65 },
    { name: 'Caesar Salad', orders: 289, revenue: 2601, category: 'Salads', popularity: 88, margin: 70 },
    { name: 'Margherita Pizza', orders: 267, revenue: 4806, category: 'Mains', popularity: 85, margin: 60 },
    { name: 'French Fries', orders: 412, revenue: 2884, category: 'Sides', popularity: 92, margin: 75 },
    { name: 'Coca-Cola', orders: 567, revenue: 2268, category: 'Drinks', popularity: 98, margin: 80 },
    { name: 'Chicken Wings', orders: 198, revenue: 3564, category: 'Appetizers', popularity: 82, margin: 62 },
    { name: 'Chocolate Cake', orders: 156, revenue: 2184, category: 'Desserts', popularity: 78, margin: 68 },
    { name: 'Coffee', orders: 423, revenue: 2115, category: 'Drinks', popularity: 90, margin: 85 },
  ];

  const orderStatusData: OrderStatus[] = [
    { status: 'Completed', count: 980, percentage: 78.7, color: '#52c41a' },
    { status: 'Processing', count: 158, percentage: 12.7, color: '#1890ff' },
    { status: 'Pending', count: 67, percentage: 5.4, color: '#fa8c16' },
    { status: 'Cancelled', count: 40, percentage: 3.2, color: '#f5222d' },
  ];

  const messageMetrics: MessageMetrics = {
    totalMessages: 5420,
    responseTime: 2.4,
    customerSatisfaction: 4.7,
    automationRate: 82,
  };

  const categoryData = [
    { name: 'Mains', value: 45, color: '#0088FE' },
    { name: 'Drinks', value: 25, color: '#00C49F' },
    { name: 'Sides', value: 15, color: '#FFBB28' },
    { name: 'Appetizers', value: 10, color: '#FF8042' },
    { name: 'Desserts', value: 5, color: '#8884D8' },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const formatValue = (metric: AnalyticsMetric) => {
    if (metric.format === 'currency') {
      return `$${Number(metric.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (metric.format === 'percent') {
      return `${metric.value}%`;
    }
    if (metric.format === 'time') {
      return `${metric.value} min`;
    }
    return Number(metric.value).toLocaleString();
  };

  const timeRangeOptions = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 days', value: '7days' },
    { label: 'Last 30 days', value: '30days' },
    { label: 'Last 90 days', value: '90days' },
    { label: 'Custom Range', value: 'custom' },
  ];

  const exportMenu = (
    <Menu
      items={[
        { key: 'pdf', label: 'Export as PDF' },
        { key: 'excel', label: 'Export as Excel' },
        { key: 'csv', label: 'Export as CSV' },
        { key: 'print', label: 'Print Report' },
      ]}
    />
  );

  const revenueTotal = useMemo(() => 
    mockOrderData.reduce((sum, day) => sum + day.revenue, 0), 
    [mockOrderData]
  );

  const ordersTotal = useMemo(() => 
    mockOrderData.reduce((sum, day) => sum + day.orders, 0), 
    [mockOrderData]
  );

  return (
    <PageContainer
      header={{
        title: 'WhatsApp Order Analytics',
        subTitle: 'Real-time insights for your WhatsApp order management system',
        breadcrumb: {
          routes: [
            { path: '/', breadcrumbName: 'Home' },
            { path: '/analytics', breadcrumbName: 'Analytics' },
          ],
        },
        extra: [
          <Space key="controls" size="middle">
            <Radio.Group
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              optionType="button"
              buttonStyle="solid"
              size="middle"
            >
              {timeRangeOptions.map(option => (
                <Radio.Button key={option.value} value={option.value}>
                  {option.label}
                </Radio.Button>
              ))}
            </Radio.Group>
            
            {timeRange === 'custom' && (
              <RangePicker
                value={dateRange}
                onChange={setDateRange}
                format="YYYY-MM-DD"
                style={{ width: 250 }}
              />
            )}
            
            <Dropdown overlay={exportMenu} placement="bottomRight">
              <Button icon={<DownloadOutlined />}>
                Export
              </Button>
            </Dropdown>
            
            <Button type="primary" icon={<EyeOutlined />}>
              Live View
            </Button>
          </Space>,
        ],
      }}
      tabList={[
        { key: 'orders', tab: 'Order Analytics' },
        { key: 'customers', tab: 'Customer Insights' },
        { key: 'products', tab: 'Product Performance' },
        { key: 'messages', tab: 'Message Analytics' },
      ]}
      tabActiveKey={activeTab}
      onTabChange={setActiveTab}
      content={
        <Alert
          message="Real-time data updates. Last updated just now."
          type="info"
          showIcon
          icon={<WhatsAppOutlined />}
          closable
          style={{ marginBottom: 16 }}
        />
      }
    >

      {activeTab === 'orders' && (
        <ProCard title="Detailed Order Analytics" headerBordered>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col span={24}>
              <ProCard
                title="Daily Order Breakdown"
                extra={
                  <Space>
                    <Tag color="green">Total Revenue: ${revenueTotal.toLocaleString()}</Tag>
                    <Tag color="blue">Total Orders: {ordersTotal.toLocaleString()}</Tag>
                  </Space>
                }
              >
                <ProTable<OrderData>
                  columns={[
                    {
                      title: 'Date',
                      dataIndex: 'date',
                      width: 100,
                      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
                    },
                    {
                      title: 'Orders',
                      dataIndex: 'orders',
                      width: 100,
                      sorter: (a, b) => a.orders - b.orders,
                      render: (text) => (
                        <Statistic value={text} valueStyle={{ fontSize: 14 }} />
                      ),
                    },
                    {
                      title: 'Revenue',
                      dataIndex: 'revenue',
                      width: 120,
                      sorter: (a, b) => a.revenue - b.revenue,
                      render: (text) => `$${text.toLocaleString()}`,
                    },
                    {
                      title: 'Avg Order Value',
                      dataIndex: 'avgOrderValue',
                      width: 140,
                      sorter: (a, b) => a.avgOrderValue - b.avgOrderValue,
                      render: (text) => `$${text.toFixed(2)}`,
                    },
                    {
                      title: 'Completed',
                      dataIndex: 'completed',
                      width: 100,
                      render: (text, record) => (
                        <Progress
                          percent={Math.round((text / record.orders) * 100)}
                          size="small"
                          status="active"
                        />
                      ),
                    },
                    {
                      title: 'Status',
                      width: 200,
                      render: (_, record) => (
                        <Space>
                          <Tag color="green">{record.completed} Completed</Tag>
                          <Tag color="blue">{record.pending} Processing</Tag>
                          <Tag color="orange">{record.cancelled} Cancelled</Tag>
                        </Space>
                      ),
                    },
                  ]}
                  dataSource={mockOrderData}
                  rowKey="date"
                  search={false}
                  pagination={false}
                />
              </ProCard>
            </Col>
          </Row>
        </ProCard>
      )}

      {activeTab === 'customers' && (
        <ProCard title="Customer Insights" headerBordered>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <ProTable<TopCustomer>
                columns={[
                  {
                    title: 'Customer',
                    dataIndex: 'name',
                    width: 150,
                    render: (text, record) => (
                      <Space>
                        <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
                          {text.charAt(0)}
                        </Avatar>
                        <div>
                          <div style={{ fontWeight: 500 }}>{text}</div>
                          <div style={{ fontSize: 12, color: '#666' }}>
                            {record.phone}
                          </div>
                        </div>
                      </Space>
                    ),
                  },
                  {
                    title: 'Total Orders',
                    dataIndex: 'totalOrders',
                    width: 120,
                    sorter: (a, b) => a.totalOrders - b.totalOrders,
                    render: (text) => (
                      <Badge
                        count={text}
                        style={{ backgroundColor: '#52c41a' }}
                      />
                    ),
                  },
                  {
                    title: 'Total Spent',
                    dataIndex: 'totalSpent',
                    width: 120,
                    sorter: (a, b) => a.totalSpent - b.totalSpent,
                    render: (text) => `$${text.toLocaleString()}`,
                  },
                  {
                    title: 'Avg Order Value',
                    dataIndex: 'avgOrderValue',
                    width: 120,
                    render: (text) => `$${text.toFixed(2)}`,
                  },
                  {
                    title: 'Last Order',
                    dataIndex: 'lastOrder',
                    width: 120,
                    render: (text) => (
                      <Tag color="blue">{text}</Tag>
                    ),
                  },
                  {
                    title: 'Favorite Items',
                    dataIndex: 'favoriteItems',
                    width: 200,
                    render: (items: string[]) => (
                      <Space wrap>
                        {items.slice(0, 2).map((item, index) => (
                          <Tag key={index} color="geekblue">
                            {item}
                          </Tag>
                        ))}
                        {items.length > 2 && (
                          <Tag>+{items.length - 2} more</Tag>
                        )}
                      </Space>
                    ),
                  },
                  {
                    title: 'Actions',
                    width: 100,
                    render: () => (
                      <Button type="link" size="small">
                        View Details
                      </Button>
                    ),
                  },
                ]}
                dataSource={mockTopCustomers}
                rowKey="id"
                toolBarRender={() => [
                  <Button key="export" icon={<DownloadOutlined />}>
                    Export Customers
                  </Button>,
                  <Button key="segment" type="primary">
                    Create Customer Segment
                  </Button>,
                ]}
                search={{
                  labelWidth: 'auto',
                }}
              />
            </Col>
          </Row>
        </ProCard>
      )}

      {activeTab === 'products' && (
        <ProCard title="Product Performance" headerBordered>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <ProTable<TopItem>
                columns={[
                  {
                    title: 'Product',
                    dataIndex: 'name',
                    width: 180,
                    render: (text, record) => (
                      <Space>
                        <TagOutlined style={{ color: record.category === 'Mains' ? '#1890ff' : 
                          record.category === 'Drinks' ? '#52c41a' : 
                          record.category === 'Sides' ? '#fa8c16' : '#722ed1' }} />
                        <div>
                          <div style={{ fontWeight: 500 }}>{text}</div>
                          <div style={{ fontSize: 12, color: '#666' }}>
                            {record.category}
                          </div>
                        </div>
                      </Space>
                    ),
                  },
                  {
                    title: 'Orders',
                    dataIndex: 'orders',
                    width: 100,
                    sorter: (a, b) => a.orders - b.orders,
                    render: (text) => (
                      <Statistic value={text} valueStyle={{ fontSize: 14 }} />
                    ),
                  },
                  {
                    title: 'Revenue',
                    dataIndex: 'revenue',
                    width: 120,
                    sorter: (a, b) => a.revenue - b.revenue,
                    render: (text) => `$${text.toLocaleString()}`,
                  },
                  {
                    title: 'Popularity',
                    dataIndex: 'popularity',
                    width: 150,
                    render: (text) => (
                      <div>
                        <Progress percent={text} size="small" />
                        <span style={{ fontSize: 12, color: '#999' }}>
                          {text}% of total orders
                        </span>
                      </div>
                    ),
                  },
                  {
                    title: 'Margin',
                    dataIndex: 'margin',
                    width: 120,
                    render: (text) => (
                      <Tag color={text > 70 ? 'success' : text > 60 ? 'warning' : 'error'}>
                        {text}% Margin
                      </Tag>
                    ),
                  },
                  {
                    title: 'Performance',
                    width: 150,
                    render: (record) => {
                      const score = (record.popularity * 0.6) + (record.margin * 0.4);
                      return (
                        <div>
                          <Progress
                            percent={Math.round(score)}
                            status={score > 80 ? 'success' : score > 60 ? 'normal' : 'exception'}
                            size="small"
                          />
                          <span style={{ fontSize: 12, color: '#999' }}>
                            Performance Score
                          </span>
                        </div>
                      );
                    },
                  },
                  {
                    title: 'Actions',
                    width: 100,
                    render: () => (
                      <Button type="link" size="small">
                        Analyze
                      </Button>
                    ),
                  },
                ]}
                dataSource={mockTopItems}
                rowKey="name"
                toolBarRender={() => [
                  <Button key="export" icon={<DownloadOutlined />}>
                    Export Products
                  </Button>,
                  <Button key="insights" type="primary" icon={<PieChartOutlined />}>
                    Get Insights
                  </Button>,
                ]}
                search={{
                  labelWidth: 'auto',
                }}
              />
            </Col>
          </Row>
        </ProCard>
      )}

      {activeTab === 'messages' && (
        <ProCard title="WhatsApp Message Analytics" headerBordered>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} md={12}>
              <ProCard title="Message Performance">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div>
                    <Statistic
                      title="Total Messages"
                      value={messageMetrics.totalMessages}
                      prefix={<MessageOutlined />}
                      valueStyle={{ fontSize: 32 }}
                    />
                    <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                      Messages exchanged this period
                    </div>
                  </div>
                  
                  <div>
                    <Statistic
                      title="Average Response Time"
                      value={messageMetrics.responseTime}
                      suffix="minutes"
                      valueStyle={{ fontSize: 32, color: '#13c2c2' }}
                    />
                    <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                      Bot response time
                    </div>
                  </div>
                  
                  <div>
                    <Statistic
                      title="Customer Satisfaction"
                      value={messageMetrics.customerSatisfaction}
                      suffix="/5.0"
                      valueStyle={{ fontSize: 32, color: '#52c41a' }}
                    />
                    <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                      Based on post-order surveys
                    </div>
                  </div>
                  
                  <div>
                    <Statistic
                      title="Automation Rate"
                      value={messageMetrics.automationRate}
                      suffix="%"
                      valueStyle={{ fontSize: 32, color: '#722ed1' }}
                    />
                    <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                      Messages handled automatically
                    </div>
                  </div>
                </Space>
              </ProCard>
            </Col>
            
            <Col xs={24} md={12}>
              <ProCard title="Message Flow Analysis" style={{ height: '100%' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockHourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="messages" name="Messages" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="orders" name="Orders" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ProCard>
            </Col>
          </Row>
          
          <ProCard title="Conversation Insights">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <ProCard>
                  <Statistic
                    title="Common Questions"
                    value="85%"
                    suffix="automated"
                    valueStyle={{ color: '#52c41a' }}
                  />
                  <div style={{ color: '#666', fontSize: 12, marginTop: 8 }}>
                    Frequently asked questions handled automatically
                  </div>
                </ProCard>
              </Col>
              <Col span={8}>
                <ProCard>
                  <Statistic
                    title="Human Handoff"
                    value="15%"
                    suffix="of conversations"
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <div style={{ color: '#666', fontSize: 12, marginTop: 8 }}>
                    Require human intervention
                  </div>
                </ProCard>
              </Col>
              <Col span={8}>
                <ProCard>
                  <Statistic
                    title="Typing Time"
                    value="45"
                    suffix="seconds avg"
                    valueStyle={{ color: '#722ed1' }}
                  />
                  <div style={{ color: '#666', fontSize: 12, marginTop: 8 }}>
                    Average customer typing time
                  </div>
                </ProCard>
              </Col>
            </Row>
          </ProCard>
        </ProCard>
      )}
    </PageContainer>
  );
};

export default AnalyticsDashboard;