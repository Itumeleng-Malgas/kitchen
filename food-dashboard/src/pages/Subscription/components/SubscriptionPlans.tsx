import React from 'react';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import {
  CheckOutlined,
  CrownOutlined,
  RocketOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Row, Col, Button, Tag, List, Space, Divider, Tooltip, Badge } from 'antd';

const { Statistic } = StatisticCard;

interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    description: string;
    price: number;
    period: string;
    features: string[];
    maxDevices: number;
    storage: string;
    support: string;
    popular: boolean;
    icon: React.ReactNode;
    color: string;
  };
  selected: boolean;
  onSelect: (planId: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, selected, onSelect }) => (
  <ProCard
    colSpan={{ xs: 24, sm: 12, md: 8 }}
    style={{
      border: selected ? `2px solid ${plan.color}` : '1px solid #d9d9d9',
      borderRadius: 12,
      position: 'relative',
      transition: 'all 0.3s',
      transform: selected ? 'translateY(-4px)' : 'none',
      boxShadow: selected ? `0 4px 12px ${plan.color}33` : 'none',
    }}
    hoverable
  >
    {plan.popular && (
      <div
        style={{
          position: 'absolute',
          top: -12,
          right: 20,
          background: plan.color,
          color: 'white',
          padding: '4px 12px',
          borderRadius: 12,
          fontSize: 12,
          fontWeight: 'bold',
          zIndex: 1,
        }}
      >
        <CrownOutlined /> MOST POPULAR
      </div>
    )}
    
    <div style={{ textAlign: 'center', marginBottom: 24 }}>
      <div style={{ fontSize: 24, color: plan.color, marginBottom: 8 }}>
        {plan.icon}
      </div>
      <h3 style={{ marginBottom: 4, fontSize: 20 }}>{plan.name}</h3>
      <p style={{ color: '#666', marginBottom: 16 }}>{plan.description}</p>
      
      <div style={{ marginBottom: 16 }}>
        <Statistic
          value={plan.price}
          prefix="$"
          suffix={
            <span style={{ fontSize: 14, color: '#666' }}>
              /{plan.period}
            </span>
          }
          valueStyle={{
            fontSize: 48,
            fontWeight: 'bold',
            color: plan.color,
          }}
        />
        <div style={{ color: '#666', fontSize: 14 }}>
          per kiosk device
        </div>
      </div>
    </div>

    <Divider style={{ margin: '16px 0' }} />
    
    <List
      dataSource={plan.features}
      renderItem={(item) => (
        <List.Item style={{ padding: '8px 0', border: 'none' }}>
          <Space>
            <CheckOutlined style={{ color: '#52c41a' }} />
            <span>{item}</span>
          </Space>
        </List.Item>
      )}
      style={{ marginBottom: 24 }}
    />

    <div style={{ padding: '16px 0', borderTop: '1px solid #f0f0f0' }}>
      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Tooltip title="Maximum kiosk devices">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#666' }}>Devices</div>
              <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                {plan.maxDevices === -1 ? 'Unlimited' : plan.maxDevices}
              </div>
            </div>
          </Tooltip>
        </Col>
        <Col span={12}>
          <Tooltip title="Cloud storage">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#666' }}>Storage</div>
              <div style={{ fontSize: 16, fontWeight: 'bold' }}>{plan.storage}</div>
            </div>
          </Tooltip>
        </Col>
      </Row>
    </div>

    <Button
      type={selected ? 'primary' : 'default'}
      block
      size="large"
      style={{
        background: selected ? plan.color : undefined,
        borderColor: plan.color,
      }}
      onClick={() => onSelect(plan.id)}
    >
      {selected ? 'Current Plan' : 'Select Plan'}
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
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small restaurants',
      price: 29,
      period: 'month',
      features: [
        'Up to 2 kiosk devices',
        'Basic menu management',
        'Email support',
        'Standard updates',
        '1GB storage',
        'Basic analytics',
      ],
      maxDevices: 2,
      storage: '1GB',
      support: 'Email',
      popular: false,
      icon: <StarOutlined />,
      color: '#1890ff',
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Best for growing businesses',
      price: 79,
      period: 'month',
      features: [
        'Up to 10 kiosk devices',
        'Advanced menu management',
        'Priority support',
        'Real-time analytics',
        'Custom branding',
        '10GB storage',
        'API access',
        'Advanced reporting',
      ],
      maxDevices: 10,
      storage: '10GB',
      support: 'Priority',
      popular: true,
      icon: <RocketOutlined />,
      color: '#722ed1',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large restaurant chains',
      price: 199,
      period: 'month',
      features: [
        'Unlimited kiosk devices',
        'Full customization',
        '24/7 dedicated support',
        'Advanced analytics',
        'Custom integrations',
        'On-premise deployment',
        'SLA guarantee',
        '100GB storage',
        'Custom training',
      ],
      maxDevices: -1, // Unlimited
      storage: '100GB',
      support: '24/7 Dedicated',
      popular: false,
      icon: <CrownOutlined />,
      color: '#13c2c2',
    },
  ];

  return (
    <ProCard title="Choose Your Plan" extra={<Tag color="blue">Annual billing saves 20%</Tag>}>
      <Row gutter={[24, 24]}>
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            selected={selectedPlan === plan.id}
            onSelect={onPlanSelect}
          />
        ))}
      </Row>
      
      <Divider />
      
      <ProCard
        title="Plan Comparison"
        style={{ marginTop: 24 }}
        headerBordered
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                Feature
              </th>
              {plans.map((plan) => (
                <th
                  key={plan.id}
                  style={{
                    textAlign: 'center',
                    padding: '12px',
                    borderBottom: '1px solid #f0f0f0',
                    color: plan.color,
                  }}
                >
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                Price per month
              </td>
              {plans.map((plan) => (
                <td
                  key={plan.id}
                  style={{
                    textAlign: 'center',
                    padding: '12px',
                    borderBottom: '1px solid #f0f0f0',
                    fontWeight: 'bold',
                  }}
                >
                  ${plan.price}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                Max Devices
              </td>
              {plans.map((plan) => (
                <td
                  key={plan.id}
                  style={{
                    textAlign: 'center',
                    padding: '12px',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  {plan.maxDevices === -1 ? 'Unlimited' : plan.maxDevices}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                Storage
              </td>
              {plans.map((plan) => (
                <td
                  key={plan.id}
                  style={{
                    textAlign: 'center',
                    padding: '12px',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  {plan.storage}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                Support
              </td>
              {plans.map((plan) => (
                <td
                  key={plan.id}
                  style={{
                    textAlign: 'center',
                    padding: '12px',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  {plan.support}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </ProCard>
    </ProCard>
  );
};

export default SubscriptionPlans;