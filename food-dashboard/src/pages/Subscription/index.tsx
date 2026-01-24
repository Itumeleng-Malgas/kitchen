import React, { useState, useEffect } from 'react';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormSelect,
  ProDescriptions,
} from '@ant-design/pro-components';
import {
  GoogleOutlined,
  CreditCardOutlined,
  DollarOutlined,
  SettingOutlined,
  TabletOutlined,
  BarChartOutlined,
  CloudOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  Row,
  Col,
  Button,
  Tag,
  Modal,
  message,
  Statistic,
  Alert,
  Divider,
  Space,
  Tabs,
  Progress,
} from 'antd';
import { useRequest } from '@umijs/max';
import SubscriptionPlans from './components/SubscriptionPlans';
import BillingHistory from './components/BillingHistory';
import PaymentMethod from './components/PaymentMethod';
import useSubscriptionModel from '@/models/subscription';

const { TabPane } = Tabs;

// Types
interface BusinessInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  subscriptionStart: string;
  nextBilling: string;
  status: 'active' | 'pending' | 'cancelled';
}

const SubscriptionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlan, setSelectedPlan] = useState<string>('professional');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Use subscription model - this provides all the data and methods
  const {
    currentPlan,
    plans,
    subscription,
    loading: modelLoading,
    updateSubscription,
    refreshAll,
  } = useSubscriptionModel();

  // Initialize data on component mount
  useEffect(() => {
    refreshAll();
  }, []);

  // Mock business data - you can replace with real data from your model or API
  const businessData: BusinessInfo = {
    id: 'BUS-123456',
    name: 'Tasty Bites Restaurant',
    email: 'admin@tastybites.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY',
    subscriptionStart: '2024-01-15',
    nextBilling: '2024-02-15',
    status: 'active',
  };

  // Fetch billing data - using useRequest for API calls
  const { data: billingData, loading: loadingBilling } = useRequest('/api/billing/history');

  // Get current plan info from subscription or use defaults
  const currentPlanName = currentPlan || 'Professional';
  const currentPlanPrice = subscription?.price || 79;
  const nextBillingDate = subscription?.nextBillingDate || '2024-02-15';

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async (paymentData: any) => {
    try {
      // Use the model's updateSubscription method
      const result = await updateSubscription({
        planId: selectedPlan,
        paymentMethodId: 'google_pay',
      });
      
      if (result?.success) {
        message.success('Subscription updated successfully!');
        setShowPaymentModal(false);
      } else {
        message.error(result?.errorMessage || 'Payment failed');
      }
    } catch (error) {
      message.error('Failed to update subscription');
      console.error('Subscription update error:', error);
    }
  };

  // Calculate usage percentages
  const storageUsagePercentage = 45; // This should come from API
  const apiUsagePercentage = 65; // This should come from API

  // Format next billing date
  const formattedNextBillingDate = new Date(nextBillingDate).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <PageContainer
      header={{
        title: 'Subscription Management',
        subTitle: 'Manage your subscription and billing',
        breadcrumb: {
          routes: [
            { path: '/', breadcrumbName: 'Home' },
            { path: '/subscription', breadcrumbName: 'Subscription' },
          ],
        },
        extra: [
          <Button 
            key="help" 
            icon={<SettingOutlined />} 
            onClick={() => window.open('/help', '_blank')}
          >
            Help
          </Button>,
          <Button 
            key="refresh" 
            icon={<SyncOutlined />} 
            onClick={() => refreshAll()}
            loading={modelLoading}
          >
            Refresh
          </Button>,
        ],
      }}
      tabList={[
        { key: 'overview', tab: 'Overview' },
        { key: 'plans', tab: 'Plans & Pricing' },
        { key: 'billing', tab: 'Billing' },
        { key: 'settings', tab: 'Settings' },
      ]}
      tabActiveKey={activeTab}
      onTabChange={setActiveTab}
      content={
        <div style={{ marginBottom: 24 }}>
          <Alert
            message={`Your subscription will renew on ${formattedNextBillingDate}`}
            type="info"
            showIcon
            closable
          />
        </div>
      }
    >
      {activeTab === 'overview' && (
        <>
          {/* Statistics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <ProCard>
                <Statistic
                  title="Current Plan"
                  value={currentPlanName}
                  prefix={<CloudOutlined />}
                  suffix={<Tag color="blue">Active</Tag>}
                />
              </ProCard>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <ProCard>
                <Statistic
                  title="Monthly Cost"
                  value={currentPlanPrice}
                  prefix={<DollarOutlined />}
                  suffix="USD"
                />
              </ProCard>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <ProCard>
                <Statistic
                  title="Next Billing"
                  value={new Date(nextBillingDate).getDate()}
                  prefix={<CreditCardOutlined />}
                  suffix={new Date(nextBillingDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                />
              </ProCard>
            </Col>
          </Row>

          {/* Business Information */}
          <ProCard title="Business Information" style={{ marginBottom: 24 }}>
            <ProDescriptions
              column={2}
              dataSource={businessData}
              columns={[
                { title: 'Business Name', dataIndex: 'name' },
                { title: 'Business ID', dataIndex: 'id' },
                { title: 'Contact Email', dataIndex: 'email' },
                { title: 'Phone Number', dataIndex: 'phone' },
                { title: 'Subscription Start', dataIndex: 'subscriptionStart' },
                { title: 'Next Billing Date', dataIndex: 'nextBilling' },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  render: (text) => (
                    <Tag color={text === 'active' ? 'success' : 'warning'}>
                      {text}
                    </Tag>
                  ),
                },
              ]}
            />
          </ProCard>

          {/* Quick Actions */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <ProCard 
                title="Quick Actions" 
                extra={<Button type="link" onClick={() => setActiveTab('settings')}>More</Button>}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    block 
                    icon={<CreditCardOutlined />}
                    onClick={() => setActiveTab('settings')}
                  >
                    Update Payment Method
                  </Button>
                  <Button 
                    block 
                    icon={<BarChartOutlined />}
                    onClick={() => window.open('/analytics', '_blank')}
                  >
                    View Usage Analytics
                  </Button>
                  <Button 
                    block 
                    icon={<SettingOutlined />}
                    onClick={() => setActiveTab('settings')}
                  >
                    Account Settings
                  </Button>
                </Space>
              </ProCard>
            </Col>
            <Col xs={24} md={12}>
              <ProCard title="Subscription Health">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                  </div>
                  <div>
                    <div style={{ marginBottom: 8 }}>Storage Usage</div>
                    <Progress 
                      percent={storageUsagePercentage} 
                      status={storageUsagePercentage >= 90 ? "exception" : "active"} 
                    />
                  </div>
                  <div>
                    <div style={{ marginBottom: 8 }}>API Calls (This Month)</div>
                    <Progress 
                      percent={apiUsagePercentage} 
                      status={apiUsagePercentage >= 90 ? "exception" : "active"} 
                    />
                  </div>
                </Space>
              </ProCard>
            </Col>
          </Row>
        </>
      )}

      {activeTab === 'plans' && (
        <SubscriptionPlans
          selectedPlan={selectedPlan}
          onPlanSelect={handlePlanSelect}
        />
      )}

      {activeTab === 'billing' && (
        <BillingHistory 
          data={billingData?.data?.list || []} 
          loading={loadingBilling} 
        />
      )}

      {activeTab === 'settings' && (
        <ProCard title="Subscription Settings">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Payment Methods" key="1">
              <PaymentMethod 
                onPaymentComplete={handlePaymentComplete} 
                loading={modelLoading}
              />
            </TabPane>
            <TabPane tab="Billing History" key="2">
              <BillingHistory 
                data={billingData?.data?.list || []} 
                loading={loadingBilling} 
              />
            </TabPane>
            <TabPane tab="Notifications" key="3">
              <ProForm
                submitter={{
                  render: (_, dom) => <div style={{ textAlign: 'right' }}>{dom}</div>,
                }}
                onFinish={async (values) => {
                  try {
                    // Save notification settings
                    await fetch('/api/settings/notifications', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(values),
                    });
                    message.success('Settings updated successfully');
                  } catch (error) {
                    message.error('Failed to update settings');
                  }
                }}
              >
                <ProFormSelect
                  name="invoiceEmail"
                  label="Invoice Notifications"
                  options={[
                    { value: 'immediate', label: 'Send immediately' },
                    { value: 'daily', label: 'Daily digest' },
                    { value: 'weekly', label: 'Weekly summary' },
                    { value: 'none', label: 'No notifications' },
                  ]}
                />
                <ProFormSelect
                  name="usageAlerts"
                  label="Usage Alerts"
                  options={[
                    { value: '80', label: 'At 80% usage' },
                    { value: '90', label: 'At 90% usage' },
                    { value: '100', label: 'At 100% usage' },
                    { value: 'none', label: 'No alerts' },
                  ]}
                />
              </ProForm>
            </TabPane>
          </Tabs>
        </ProCard>
      )}

      {/* Payment Modal */}
      <Modal
        title="Confirm Subscription Change"
        open={showPaymentModal}
        onCancel={() => setShowPaymentModal(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        <div style={{ padding: 24 }}>
          <Alert
            message="You are about to change your subscription plan"
            description="This change will be effective immediately. Pro-rated charges may apply."
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          
          <ProCard>
            <PaymentMethod
              compact
              onPaymentComplete={handlePaymentComplete}
              loading={modelLoading}
            />
          </ProCard>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default SubscriptionPage;