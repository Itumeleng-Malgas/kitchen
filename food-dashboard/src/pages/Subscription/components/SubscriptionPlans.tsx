import React from 'react';
import { ProCard } from '@ant-design/pro-components';
import {
  CheckOutlined,
  RocketOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Row, Col, Button, Tag, List, Space, Divider, Badge, Statistic } from 'antd';

interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    description: string;
    price: number;
    features: string[];
    popular: boolean;
    icon: React.ReactNode;
    color: string;
  };
  selected: boolean;
  onSelect: (planId: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, selected, onSelect }) => (
  <ProCard
    style={{
      border: selected ? `2px solid ${plan.color}` : '1px solid #d9d9d9',
      borderRadius: 12,
      position: 'relative',
      transition: 'all 0.3s',
      transform: selected ? 'translateY(-4px)' : 'none',
      boxShadow: selected ? `0 4px 12px ${plan.color}33` : 'none',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
    hoverable
  >
    {plan.popular && (
      <Badge.Ribbon 
        text="MOST POPULAR" 
        color={plan.color}
        style={{ top: 16, right: -32 }}
      />
    )}
    
    <div style={{ textAlign: 'center', marginBottom: 24, flex: 1 }}>
      <div style={{ fontSize: 32, color: plan.color, marginBottom: 12 }}>
        {plan.icon}
      </div>
      <h3 style={{ marginBottom: 4, fontSize: 24, fontWeight: 600 }}>{plan.name}</h3>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>{plan.description}</p>
      
      <div style={{ marginBottom: 24 }}>
        <Statistic
          title={plan.price === 0 ? "Free Forever" : "Monthly Price"}
          value={plan.price}
          prefix={plan.price > 0 ? "$" : undefined}
          suffix={plan.price > 0 ? '/month' : ''}
          valueStyle={{
            fontSize: plan.price > 0 ? 40 : 36,
            fontWeight: 'bold',
            color: plan.color,
          }}
        />
        <div style={{ color: '#666', fontSize: 14, marginTop: 8 }}>
          {plan.price === 0 ? 'No credit card required' : 'Unlimited kiosks • Cancel anytime'}
        </div>
      </div>

      <Divider style={{ margin: '16px 0' }} />
      
      <div style={{ textAlign: 'left' }}>
        <h4 style={{ marginBottom: 16, fontSize: 16 }}>Features</h4>
        <List
          dataSource={plan.features}
          renderItem={(item) => (
            <List.Item style={{ padding: '8px 0', border: 'none' }}>
              <Space>
                <CheckOutlined style={{ color: '#52c41a' }} />
                <span style={{ fontSize: 14 }}>{item}</span>
              </Space>
            </List.Item>
          )}
          style={{ marginBottom: 24 }}
        />
      </div>
    </div>

    <Button
      type={selected ? 'primary' : plan.id === 'free' ? 'default' : 'primary'}
      block
      size="large"
      style={{
        background: selected ? plan.color : plan.id === 'free' ? undefined : plan.color,
        borderColor: plan.color,
        marginTop: 'auto',
        height: 48,
        fontSize: 16,
        fontWeight: 600,
      }}
      onClick={() => onSelect(plan.id)}
    >
      {selected ? 'Current Plan' : plan.price === 0 ? 'Get Started Free' : 'Upgrade to PRO'}
    </Button>
  </ProCard>
);

interface SubscriptionPlansProps {
  selectedPlan: string;
  onPlanSelect: (planId: string) => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  selectedPlan,
  onPlanSelect,
}) => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started',
      price: 0,
      features: [
        'Unlimited kiosk devices',
        'Basic menu management',
        'Community support',
        'Standard updates',
        '1GB storage',
        'Basic analytics dashboard',
        'Up to 100 orders/month',
        'Email notifications',
      ],
      popular: false,
      icon: <StarOutlined />,
      color: '#52c41a',
    },
    {
      id: 'pro',
      name: 'PRO',
      description: 'Advanced features for growing businesses',
      price: 99,
      features: [
        'Unlimited kiosk devices',
        'Advanced menu management',
        'Priority email & chat support',
        'Real-time analytics dashboard',
        'Custom branding & themes',
        '50GB storage',
        'API access & webhooks',
        'Advanced reporting & insights',
        'Unlimited orders',
        'SMS & email notifications',
        'Custom integrations',
      ],
      popular: true,
      icon: <RocketOutlined />,
      color: '#722ed1',
    },
  ];

  return (
    <ProCard 
      title="Choose Your Plan" 
      extra={
        <Space>
          <Tag color="green">Unlimited Devices</Tag>
          <Tag color="blue">Annual billing saves 20%</Tag>
        </Space>
      }
      headerBordered
    >
      <div style={{ padding: '0 8px' }}>
        <Row gutter={[24, 24]} justify="center">
          {plans.map((plan) => (
            <Col 
              key={plan.id} 
              xs={24} 
              sm={24} 
              md={12} 
              lg={10}
              style={{ display: 'flex' }}
            >
              <PlanCard
                plan={plan}
                selected={selectedPlan === plan.id}
                onSelect={onPlanSelect}
              />
            </Col>
          ))}
        </Row>
      </div>
    </ProCard>
  );
};

export default SubscriptionPlans;