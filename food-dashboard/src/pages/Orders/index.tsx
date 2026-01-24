import React, { useState, useRef } from 'react';
import PageContainer from '@/components/PageContainer';
import {
  ProCard,
  ProTable,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormDatePicker,
  ProFormDigit,
  ProFormTextArea,
} from '@ant-design/pro-components';
import {
  ShoppingOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  PrinterOutlined,
  MessageOutlined,
  WhatsAppOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SyncOutlined,
  BarChartOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import {
  Button,
  Space,
  Tag,
  Modal,
  message,
  Dropdown,
  Menu,
  Input,
  DatePicker,
  Select,
  Badge,
  Avatar,
  Typography,
  Popconfirm,
  Card,
  Statistic,
  Row,
  Col,
  Divider,
  Tabs,
  Descriptions,
  List,
  Tooltip,
  Switch,
} from 'antd';
import { useRequest } from '@umijs/max';
import moment from 'moment';
import type { ProColumns, ActionType } from '@ant-design/pro-components';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;

interface Order {
  id: string;
  customerName: string;
  phone: string;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'ready' | 'completed' | 'cancelled';
  payment: 'paid' | 'pending' | 'failed';
  items: OrderItem[];
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deliveryType: 'pickup' | 'delivery';
  estimatedTime?: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  notes?: string;
}

interface OrderStats {
  total: number;
  revenue: number;
  pending: number;
  processing: number;
  completed: number;
  cancelled: number;
  avgOrderValue: number;
  todayOrders: number;
}

const OrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<any>({});
  const actionRef = useRef<ActionType>();

  // Mock data
  const orderStats: OrderStats = {
    total: 1245,
    revenue: 24580,
    pending: 23,
    processing: 15,
    completed: 1180,
    cancelled: 27,
    avgOrderValue: 19.73,
    todayOrders: 124,
  };

  const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => ({
    id: `ORD-${String(i + 1).padStart(4, '0')}`,
    customerName: ['John Smith', 'Maria Garcia', 'Robert Johnson', 'Sarah Williams', 'Michael Brown'][i % 5],
    phone: `+1 (555) ${1000 + i}`,
    total: Math.floor(Math.random() * 100) + 15,
    status: ['pending', 'confirmed', 'processing', 'ready', 'completed', 'cancelled'][Math.floor(Math.random() * 6)] as any,
    payment: ['paid', 'pending', 'failed'][Math.floor(Math.random() * 3)] as any,
    items: [
      { id: '1', name: 'Classic Burger', quantity: 2, price: 12.99, total: 25.98 },
      { id: '2', name: 'French Fries', quantity: 1, price: 4.99, total: 4.99 },
      { id: '3', name: 'Coca-Cola', quantity: 2, price: 2.99, total: 5.98 },
    ],
    address: i % 2 === 0 ? '123 Main St, New York, NY 10001' : undefined,
    notes: i % 3 === 0 ? 'Extra ketchup please' : undefined,
    createdAt: moment().subtract(Math.floor(Math.random() * 30), 'days').toISOString(),
    updatedAt: moment().subtract(Math.floor(Math.random() * 24), 'hours').toISOString(),
    deliveryType: i % 2 === 0 ? 'delivery' : 'pickup',
    estimatedTime: i % 2 === 0 ? '30-45 minutes' : undefined,
  }));

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'default';
      case 'confirmed': return 'processing';
      case 'processing': return 'warning';
      case 'ready': return 'success';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <ClockCircleOutlined />;
      case 'confirmed': return <CheckCircleOutlined />;
      case 'processing': return <SyncOutlined spin />;
      case 'ready': return <CheckCircleOutlined />;
      case 'completed': return <CheckCircleOutlined />;
      case 'cancelled': return <CloseCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getPaymentColor = (payment: Order['payment']) => {
    switch (payment) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      message.success(`Order status updated to ${status}`);
      actionRef.current?.reload();
    } catch (error) {
      message.error('Failed to update order status');
    }
  };

  const handleSendMessage = (phone: string) => {
    const message = `Hello! This is regarding your order.`;
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleExportOrders = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      // Export logic
      message.success(`Exporting orders as ${format.toUpperCase()}`);
    } catch (error) {
      message.error('Failed to export orders');
    }
  };

  const exportMenu = (
    <Menu
      items={[
        { key: 'csv', label: 'Export as CSV', icon: <DownloadOutlined /> },
        { key: 'excel', label: 'Export as Excel', icon: <DownloadOutlined /> },
        { key: 'pdf', label: 'Export as PDF', icon: <PrinterOutlined /> },
      ]}
      onClick={({ key }) => handleExportOrders(key as any)}
    />
  );

  const filterMenu = (
    <Menu
      items={[
        { key: 'today', label: 'Today' },
        { key: 'yesterday', label: 'Yesterday' },
        { key: 'week', label: 'This Week' },
        { key: 'month', label: 'This Month' },
        { type: 'divider' },
        { key: 'pending', label: 'Pending Orders' },
        { key: 'processing', label: 'Processing Orders' },
        { key: 'completed', label: 'Completed Orders' },
      ]}
    />
  );

  const columns: ProColumns<Order>[] = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      width: 120,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      width: 150,
      render: (text, record) => (
        <Space>
          <Avatar size="small">
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
      title: 'Amount',
      dataIndex: 'total',
      width: 100,
      sorter: (a, b) => a.total - b.total,
      render: (text) => `$${text.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      filters: true,
      onFilter: true,
      render: (text, record) => (
        <Space>
          <Tag 
            color={getStatusColor(text)} 
            icon={getStatusIcon(text)}
          >
            {text.toUpperCase()}
          </Tag>
          {record.deliveryType === 'delivery' && (
            <Tag color="blue">DELIVERY</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'payment',
      width: 100,
      render: (text) => (
        <Tag color={getPaymentColor(text)}>
          {text.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Delivery',
      dataIndex: 'deliveryType',
      width: 100,
      render: (text) => (
        <Tag color={text === 'delivery' ? 'blue' : 'green'}>
          {text.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      width: 150,
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render: (text) => moment(text).format('MMM D, YYYY HH:mm'),
    },
    {
      title: 'Actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewOrder(record)}
            />
          </Tooltip>
          
          <Tooltip title="Send WhatsApp Message">
            <Button
              type="text"
              icon={<WhatsAppOutlined />}
              onClick={() => handleSendMessage(record.phone)}
              style={{ color: '#25D366' }}
            />
          </Tooltip>
          
          <Dropdown
            menu={{
              items: [
                { key: 'confirmed', label: 'Confirm', icon: <CheckCircleOutlined /> },
                { key: 'processing', label: 'Start Processing', icon: <SyncOutlined /> },
                { key: 'ready', label: 'Mark as Ready', icon: <CheckCircleOutlined /> },
                { key: 'completed', label: 'Complete', icon: <CheckCircleOutlined /> },
                { type: 'divider' },
                { key: 'cancelled', label: 'Cancel', icon: <CloseCircleOutlined />, danger: true },
              ],
              onClick: ({ key }) => handleUpdateStatus(record.id, key as any),
            }}
            trigger={['click']}
          >
            <Button type="text" icon={<EditOutlined />} />
          </Dropdown>
          
          <Popconfirm
            title="Delete this order?"
            description="This action cannot be undone."
            onConfirm={() => message.success('Order deleted')}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredOrders = mockOrders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return order.status === 'pending';
    if (activeTab === 'processing') return order.status === 'processing' || order.status === 'confirmed';
    if (activeTab === 'completed') return order.status === 'completed';
    if (activeTab === 'cancelled') return order.status === 'cancelled';
    return true;
  });

  return (
    <PageContainer
      header={{
        title: 'Order Management',
        subTitle: 'Manage and track all WhatsApp orders',
        breadcrumb: {
          routes: [
            { path: '/', breadcrumbName: 'Home' },
            { path: '/orders', breadcrumbName: 'Orders' },
          ],
        },
        extra: [
          <Button 
            key="create" 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setShowCreateModal(true)}
          >
            Create Order
          </Button>,
        ],
      }}
      tabList={[
        { key: 'all', tab: 'All Orders' },
        { key: 'pending', tab: 'Pending' },
        { key: 'processing', tab: 'Processing' },
        { key: 'completed', tab: 'Completed' },
        { key: 'cancelled', tab: 'Cancelled' },
      ]}
      tabActiveKey={activeTab}
      onTabChange={setActiveTab}
      content={
        <Row gutter={[16, 16]}>
          {[
            { title: 'Total Orders', value: orderStats.total, color: '#1890ff', icon: <ShoppingOutlined /> },
            { title: 'Total Revenue', value: `$${orderStats.revenue.toLocaleString()}`, color: '#52c41a', icon: <DollarOutlined /> },
            { title: 'Pending', value: orderStats.pending, color: '#fa8c16', icon: <ClockCircleOutlined /> },
            { title: 'Processing', value: orderStats.processing, color: '#722ed1', icon: <SyncOutlined /> },
            { title: 'Completed', value: orderStats.completed, color: '#13c2c2', icon: <CheckCircleOutlined /> },
            { title: 'Avg Order', value: `$${orderStats.avgOrderValue.toFixed(2)}`, color: '#f5222d', icon: <BarChartOutlined /> },
          ].map((stat, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={4}>
              <Card size="small">
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={
                    <span style={{ color: stat.color, marginRight: 8 }}>
                      {stat.icon}
                    </span>
                  }
                  valueStyle={{ color: stat.color, fontSize: 20 }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      }
    >
      <ProCard>
        <ProTable<Order>
          actionRef={actionRef}
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          search={false}
          toolBarRender={() => [
            <Input
              key="search"
              placeholder="Search orders..."
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />,
            <Dropdown key="filter" overlay={filterMenu}>
              <Button icon={<FilterOutlined />}>
                Filter
              </Button>
            </Dropdown>,
            <Dropdown key="export" overlay={exportMenu}>
              <Button icon={<DownloadOutlined />}>
                Export
              </Button>
            </Dropdown>,
            <Button key="refresh" icon={<SyncOutlined />}>
              Refresh
            </Button>,
          ]}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
          options={{
            density: true,
            fullScreen: true,
            reload: () => actionRef.current?.reload(),
            setting: true,
          }}
          dateFormatter="string"
          headerTitle="Orders"
        />
      </ProCard>

      {/* Order Detail Modal */}
      <Modal
        title={`Order Details - ${selectedOrder?.id}`}
        open={showOrderModal}
        onCancel={() => setShowOrderModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowOrderModal(false)}>
            Close
          </Button>,
          <Button 
            key="whatsapp" 
            type="primary" 
            icon={<WhatsAppOutlined />}
            onClick={() => selectedOrder && handleSendMessage(selectedOrder.phone)}
            style={{ background: '#25D366', borderColor: '#25D366' }}
          >
            Message Customer
          </Button>,
        ]}
        width={800}
      >
        {selectedOrder && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Order Summary */}
            <ProCard>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Customer">
                      <Text strong>{selectedOrder.customerName}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone">
                      <Text copyable>{selectedOrder.phone}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Order Type">
                      <Tag color={selectedOrder.deliveryType === 'delivery' ? 'blue' : 'green'}>
                        {selectedOrder.deliveryType.toUpperCase()}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={12}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Status">
                      <Tag 
                        color={getStatusColor(selectedOrder.status)} 
                        icon={getStatusIcon(selectedOrder.status)}
                      >
                        {selectedOrder.status.toUpperCase()}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment">
                      <Tag color={getPaymentColor(selectedOrder.payment)}>
                        {selectedOrder.payment.toUpperCase()}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created">
                      {moment(selectedOrder.createdAt).format('MMM D, YYYY HH:mm')}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </ProCard>

            {/* Delivery Information */}
            {selectedOrder.deliveryType === 'delivery' && selectedOrder.address && (
              <ProCard title="Delivery Information">
                <Space direction="vertical" size="small">
                  <Text strong>Delivery Address:</Text>
                  <Text>{selectedOrder.address}</Text>
                  {selectedOrder.estimatedTime && (
                    <Text type="secondary">
                      Estimated delivery: {selectedOrder.estimatedTime}
                    </Text>
                  )}
                </Space>
              </ProCard>
            )}

            {/* Order Items */}
            <ProCard title="Order Items">
              <List
                dataSource={selectedOrder.items}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Text strong>${item.total.toFixed(2)}</Text>,
                    ]}
                  >
                    <List.Item.Meta
                      title={`${item.name} x${item.quantity}`}
                      description={`$${item.price.toFixed(2)} each`}
                    />
                  </List.Item>
                )}
                footer={
                  <div style={{ textAlign: 'right' }}>
                    <Text strong>Subtotal: ${selectedOrder.total.toFixed(2)}</Text>
                    <br />
                    <Text type="secondary">Total: ${selectedOrder.total.toFixed(2)}</Text>
                  </div>
                }
              />
            </ProCard>

            {/* Notes */}
            {selectedOrder.notes && (
              <ProCard title="Order Notes">
                <Text>{selectedOrder.notes}</Text>
              </ProCard>
            )}

            {/* Status Update */}
            <ProCard title="Update Status">
              <Space wrap>
                {['confirmed', 'processing', 'ready', 'completed', 'cancelled'].map((status) => (
                  <Button
                    key={status}
                    type={selectedOrder.status === status ? 'primary' : 'default'}
                    onClick={() => handleUpdateStatus(selectedOrder.id, status as any)}
                  >
                    {status.toUpperCase()}
                  </Button>
                ))}
              </Space>
            </ProCard>
          </Space>
        )}
      </Modal>

      {/* Create Order Modal */}
      <Modal
        title="Create New Order"
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
        width={600}
      >
        <ProForm
          layout="vertical"
          onFinish={async (values) => {
            console.log(values);
            message.success('Order created successfully');
            setShowCreateModal(false);
          }}
          submitter={{
            render: (props, dom) => [
              <Button key="cancel" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={() => props.form?.submit?.()}>
                Create Order
              </Button>,
            ],
          }}
        >
          <ProFormText
            name="customerName"
            label="Customer Name"
            rules={[{ required: true }]}
            placeholder="Enter customer name"
          />
          
          <ProFormText
            name="phone"
            label="Phone Number"
            rules={[
              { required: true },
              { pattern: /^\+?[\d\s\-\(\)]+$/, message: 'Please enter a valid phone number' },
            ]}
            placeholder="+1 (555) 123-4567"
          />
          
          <ProFormSelect
            name="deliveryType"
            label="Order Type"
            options={[
              { value: 'pickup', label: 'Pickup' },
              { value: 'delivery', label: 'Delivery' },
            ]}
            rules={[{ required: true }]}
          />
          
          <ProFormTextArea
            name="address"
            label="Delivery Address"
            placeholder="Enter delivery address"
            dependencies={['deliveryType']}
            rules={[
              ({ getFieldValue }) => ({
                required: getFieldValue('deliveryType') === 'delivery',
                message: 'Delivery address is required for delivery orders',
              }),
            ]}
          />
          
          <ProFormTextArea
            name="notes"
            label="Order Notes"
            placeholder="Any special instructions or notes"
          />
          
          <Divider>Order Items</Divider>
          
          <ProForm.Item label="Items">
            <List
              locale={{ emptyText: 'No items added' }}
              footer={
                <Button type="dashed" block icon={<PlusOutlined />}>
                  Add Item
                </Button>
              }
            />
          </ProForm.Item>
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default OrdersPage;