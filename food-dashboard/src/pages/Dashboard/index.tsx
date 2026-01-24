import React, { useState } from 'react';
import PageContainer from '@/components/PageContainer';
import { ProCard } from '@ant-design/pro-components';
import {
  ShoppingOutlined,
  DollarOutlined,
  UserOutlined,
  MessageOutlined,
  WhatsAppOutlined,
  FireOutlined,
  StarOutlined,
  MessageOutlined as BroadcastIcon,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
  Row,
  Col,
  Button,
  Tag,
  Space,
  Statistic,
  Alert,
  Typography,
  Progress,
  Badge,
  List,
  Avatar,
} from 'antd';
import { useRequest, useNavigate } from '@umijs/max';

const { Title, Text } = Typography;

interface RecentOrder {
  id: string;
  customer: string;
  phone: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: number;
  time: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Fetch real-time data
  const { data: dashboardData, loading, run: refreshData } = useRequest('/api/dashboard/realtime');
  const { data: recentOrders, loading: ordersLoading } = useRequest('/api/orders/recent');

  // Mock data for initial display (remove when API is ready)
  const mockRecentOrders: RecentOrder[] = [
    { id: 'ORD-001', customer: 'John Smith', phone: '+1 (555) 123-4567', total: 28.50, status: 'completed', items: 3, time: '2 minutes ago' },
    { id: 'ORD-002', customer: 'Maria Garcia', phone: '+1 (555) 234-5678', total: 42.75, status: 'processing', items: 4, time: '5 minutes ago' },
    { id: 'ORD-003', customer: 'Robert Johnson', phone: '+1 (555) 345-6789', total: 19.99, status: 'pending', items: 2, time: '10 minutes ago' },
    { id: 'ORD-004', customer: 'Sarah Williams', phone: '+1 (555) 456-7890', total: 67.25, status: 'completed', items: 5, time: '15 minutes ago' },
  ];

  const mockDashboardData = {
    todayOrders: 124,
    todayRevenue: 2458,
    activeCustomers: 89,
    messagesToday: 542,
    avgResponseTime: '2.4',
    completionRate: 94,
    peakHour: '12 PM',
    peakHourOrders: 78,
    peakHourConversion: 41.3,
    customerSatisfaction: 4.7,
    satisfactionRatings: 124,
  };

  const displayData = dashboardData || mockDashboardData;
  const displayOrders = recentOrders || mockRecentOrders;

  const getStatusColor = (status: RecentOrder['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'processing';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: RecentOrder['status']) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'processing': return 'Processing';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const handleSubscription = () => {
    navigate('/subscription');
  };

  const handleSendBroadcast = () => {
    // Implement broadcast functionality
    console.log('Send broadcast message');
  };

  const handleCreateOrder = () => {
    // Implement create order functionality
    console.log('Create quick order');
  };

  const handleTestIntegration = () => {
    // Implement WhatsApp test functionality
    console.log('Test WhatsApp integration');
  };

  const handleViewIssues = () => {
    // Implement view issues functionality
    console.log('View issues');
  };

  return (
    <PageContainer
      header={{
        title: 'Dashboard',
        subTitle: 'Real-time overview of your WhatsApp order system',
        breadcrumb: {
          routes: [
            { path: '/', breadcrumbName: 'Home' },
            { path: '/dashboard', breadcrumbName: 'Dashboard' },
          ],
        },
        extra: [
          <Button 
            key="subscription" 
            icon={<DollarOutlined />} 
            onClick={handleSubscription}
            loading={loading}
            type='dashed'
            danger
          >
            Subscription
          </Button>,
        ],
      }}
      content={
        <Alert
          message="Live updates enabled • Data refreshes every 30 seconds"
          type="info"
          showIcon
          icon={<WhatsAppOutlined />}
          closable
        />
      }
    >
      {/* Key Metrics */}
      <ProCard style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <ProCard
              hoverable
              style={{
                borderLeft: '4px solid #1890ff',
                height: '100%',
              }}
            >
              <Statistic
                title={
                  <Space>
                    <span style={{ color: '#1890ff' }}>
                      <ShoppingOutlined />
                    </span>
                    <span>Today's Orders</span>
                  </Space>
                }
                value={displayData.todayOrders}
                valueStyle={{
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
              />
            </ProCard>
          </Col>
          
          <Col xs={24} sm={12} md={8}>
            <ProCard
              hoverable
              style={{
                borderLeft: '4px solid #52c41a',
                height: '100%',
              }}
            >
              <Statistic
                title={
                  <Space>
                    <span style={{ color: '#52c41a' }}>
                      <DollarOutlined />
                    </span>
                    <span>Today's Revenue</span>
                  </Space>
                }
                value={displayData.todayRevenue}
                prefix="$"
                valueStyle={{
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
              />
            </ProCard>
          </Col>
          
          <Col xs={24} sm={12} md={8}>
            <ProCard
              hoverable
              style={{
                borderLeft: '4px solid #722ed1',
                height: '100%',
              }}
            >
              <Statistic
                title={
                  <Space>
                    <span style={{ color: '#722ed1' }}>
                      <UserOutlined />
                    </span>
                    <span>Active Customers</span>
                  </Space>
                }
                value={displayData.activeCustomers}
                valueStyle={{
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
              />
            </ProCard>
          </Col>
          
          <Col xs={24} sm={12} md={8}>
            <ProCard
              hoverable
              style={{
                borderLeft: '4px solid #fa8c16',
                height: '100%',
              }}
            >
              <Statistic
                title={
                  <Space>
                    <span style={{ color: '#fa8c16' }}>
                      <MessageOutlined />
                    </span>
                    <span>Messages Today</span>
                  </Space>
                }
                value={displayData.messagesToday}
                valueStyle={{
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
              />
            </ProCard>
          </Col>
          
          <Col xs={24} sm={12} md={8}>
            <ProCard
              hoverable
              style={{
                borderLeft: '4px solid #13c2c2',
                height: '100%',
              }}
            >
              <Statistic
                title={
                  <Space>
                    <span style={{ color: '#13c2c2' }}>
                      <WhatsAppOutlined />
                    </span>
                    <span>Response Time</span>
                  </Space>
                }
                value={displayData.avgResponseTime}
                suffix="min"
                valueStyle={{
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
              />
            </ProCard>
          </Col>
          
          <Col xs={24} sm={12} md={8}>
            <ProCard
              hoverable
              style={{
                borderLeft: '4px solid #f5222d',
                height: '100%',
              }}
            >
              <Statistic
                title={
                  <Space>
                    <span style={{ color: '#f5222d' }}>
                      <ShoppingOutlined />
                    </span>
                    <span>Completion Rate</span>
                  </Space>
                }
                value={displayData.completionRate}
                suffix="%"
                valueStyle={{
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
              />
            </ProCard>
          </Col>
        </Row>
      </ProCard>

      {/* Recent Activity Row */}
      <Row gutter={[16, 16]}>
        {/* Recent Orders */}
        <Col xs={24} lg={16}>
          <ProCard
            title="Recent Orders"
            extra={
              <Button type="link" href="/orders">
                View All
              </Button>
            }
            headerBordered
            loading={ordersLoading}
          >
            <List
              dataSource={displayOrders}
              renderItem={(order: RecentOrder) => (
                <List.Item
                  actions={[
                    <Button key="view" type="link" size="small" href={`/orders/${order.id}`}>
                      View
                    </Button>,
                    <Button key="process" type="link" size="small" href={`/orders/${order.id}/process`}>
                      Process
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge
                        status={getStatusColor(order.status) as any}
                        text={
                          <Avatar
                            size="small"
                            style={{
                              backgroundColor: order.status === 'completed' ? '#52c41a' :
                                              order.status === 'processing' ? '#1890ff' :
                                              order.status === 'pending' ? '#fa8c16' : '#f5222d',
                            }}
                          >
                            {order.customer.charAt(0)}
                          </Avatar>
                        }
                      />
                    }
                    title={
                      <Space>
                        <Text strong>{order.id}</Text>
                        <Tag color={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={0}>
                        <Text>
                          {order.customer} • {order.phone}
                        </Text>
                        <Text type="secondary">
                          {order.items} items • ${order.total.toFixed(2)} • {order.time}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </ProCard>
        </Col>

        {/* Quick Stats & Actions */}
        <Col xs={24} lg={8}>
          <ProCard direction="column" ghost gutter={[16, 16]}>
            {/* Peak Hour */}
            <ProCard>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={5} style={{ marginBottom: 8 }}>
                  <FireOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
                  Peak Hour Today
                </Title>
                <Statistic
                  value={displayData.peakHour}
                  suffix={
                    <Text type="secondary">
                      ({displayData.peakHourOrders} orders, {displayData.peakHourConversion}% conversion)
                    </Text>
                  }
                  valueStyle={{ fontSize: 32, color: '#fa8c16' }}
                />
                <Progress 
                  percent={displayData.peakHourConversion} 
                  size="small" 
                  strokeColor="#fa8c16" 
                  format={() => `${displayData.peakHourConversion}% conversion`}
                />
              </Space>
            </ProCard>

            {/* Customer Satisfaction */}
            <ProCard>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={5} style={{ marginBottom: 8 }}>
                  <StarOutlined style={{ color: '#fadb14', marginRight: 8 }} />
                  Customer Satisfaction
                </Title>
                <Statistic
                  value={displayData.customerSatisfaction}
                  suffix="/5.0"
                  valueStyle={{ fontSize: 32, color: '#fadb14' }}
                />
                <Progress
                  percent={(displayData.customerSatisfaction / 5) * 100}
                  size="small"
                  strokeColor={{
                    '0%': '#fadb14',
                    '100%': '#52c41a',
                  }}
                  format={() => `${displayData.customerSatisfaction.toFixed(1)}/5.0`}
                />
                <Text type="secondary">Based on {displayData.satisfactionRatings} ratings today</Text>
              </Space>
            </ProCard>

            {/* Quick Actions */}
            <ProCard title="Quick Actions">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button 
                  block 
                  icon={<BroadcastIcon />}
                  onClick={handleSendBroadcast}
                >
                  Send Broadcast Message
                </Button>
                <Button 
                  block 
                  icon={<ShoppingOutlined />}
                  onClick={handleCreateOrder}
                >
                  Create Quick Order
                </Button>
                <Button 
                  block 
                  icon={<WhatsAppOutlined />}
                  onClick={handleTestIntegration}
                >
                  Test WhatsApp Integration
                </Button>
                <Button 
                  block 
                  icon={<ExclamationCircleOutlined />}
                  onClick={handleViewIssues}
                >
                  View Issues
                </Button>
              </Space>
            </ProCard>
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default DashboardPage;