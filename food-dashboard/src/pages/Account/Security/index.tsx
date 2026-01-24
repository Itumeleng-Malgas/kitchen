import React, { useState } from 'react';
import PageContainer from '@/components/PageContainer';
import {
  ProCard,
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormDigit,
  ProFormSwitch,
  ProTable,
} from '@ant-design/pro-components';
import {
  LockOutlined,
  SafetyOutlined,
  UserDeleteOutlined,
  KeyOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  QrcodeOutlined,
  MobileOutlined,
  MailOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LogoutOutlined,
  HistoryOutlined,
  DeleteOutlined,
  DownloadOutlined,
  DatabaseOutlined,
  TeamOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import {
  Button,
  Modal,
  message,
  Alert,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Statistic,
  Tag,
  Badge,
  Tabs,
  QRCode,
  Input,
  List,
  Progress,
  Timeline,
  Switch,
  Popconfirm,
  Card,
  Avatar,
  Descriptions,
  notification,
} from 'antd';
import { useRequest } from '@umijs/max';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface SecurityMetric {
  title: string;
  value: number | string;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  icon: React.ReactNode;
  description: string;
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'password_change' | '2fa_enabled' | 'device_added' | 'suspicious' | 'logout';
  description: string;
  ip: string;
  location: string;
  device: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
}

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  current: boolean;
}

interface TwoFactorMethod {
  type: 'authenticator' | 'sms' | 'email' | 'backup';
  name: string;
  status: 'enabled' | 'disabled';
  lastUsed?: string;
}

const SecuritySettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [twoFactorType, setTwoFactorType] = useState<'authenticator' | 'sms' | 'email'>('authenticator');

  // Mock data
  const securityMetrics: SecurityMetric[] = [
    {
      title: 'Security Score',
      value: 92,
      status: 'excellent',
      icon: <LockOutlined />,
      description: 'Based on your security settings',
    },
    {
      title: 'Active Sessions',
      value: 3,
      status: 'good',
      icon: <TeamOutlined />,
      description: 'Devices currently logged in',
    },
    {
      title: 'Last Password Change',
      value: '45 days',
      status: 'fair',
      icon: <ClockCircleOutlined />,
      description: 'Time since last password update',
    },
    {
      title: '2FA Status',
      value: 'Enabled',
      status: 'excellent',
      icon: <SafetyOutlined />,
      description: 'Two-factor authentication active',
    },
  ];

  const securityEvents: SecurityEvent[] = [
    { id: '1', type: 'login', description: 'Successful login', ip: '192.168.1.100', location: 'New York, US', device: 'Chrome on Windows', timestamp: '2024-01-20 14:30:00', status: 'success' },
    { id: '2', type: '2fa_enabled', description: 'Two-factor authentication enabled', ip: '192.168.1.100', location: 'New York, US', device: 'Chrome on Windows', timestamp: '2024-01-19 10:15:00', status: 'success' },
    { id: '3', type: 'login', description: 'Failed login attempt', ip: '203.0.113.25', location: 'London, UK', device: 'Firefox on macOS', timestamp: '2024-01-18 22:45:00', status: 'failed' },
    { id: '4', type: 'password_change', description: 'Password changed', ip: '192.168.1.100', location: 'New York, US', device: 'Chrome on Windows', timestamp: '2024-01-15 09:20:00', status: 'success' },
    { id: '5', type: 'suspicious', description: 'Unusual login location detected', ip: '198.51.100.10', location: 'Tokyo, Japan', device: 'Safari on iOS', timestamp: '2024-01-14 03:15:00', status: 'warning' },
    { id: '6', type: 'device_added', description: 'New device registered', ip: '192.168.1.101', location: 'New York, US', device: 'Mobile App', timestamp: '2024-01-12 16:40:00', status: 'success' },
    { id: '7', type: 'logout', description: 'Session terminated by admin', ip: '192.168.1.100', location: 'New York, US', device: 'Chrome on Windows', timestamp: '2024-01-10 11:25:00', status: 'success' },
  ];

  const activeSessions: ActiveSession[] = [
    { id: '1', device: 'Windows PC', browser: 'Chrome 120', ip: '192.168.1.100', location: 'New York, US', lastActive: '2024-01-20 14:30:00', current: true },
    { id: '2', device: 'iPhone 14', browser: 'Safari 17', ip: '192.168.1.102', location: 'New York, US', lastActive: '2024-01-20 10:15:00', current: false },
    { id: '3', device: 'MacBook Pro', browser: 'Firefox 121', ip: '203.0.113.25', location: 'London, UK', lastActive: '2024-01-18 22:45:00', current: false },
  ];

  const twoFactorMethods: TwoFactorMethod[] = [
    { type: 'authenticator', name: 'Authenticator App', status: 'enabled', lastUsed: '2024-01-20 14:30:00' },
    { type: 'sms', name: 'SMS Verification', status: 'disabled' },
    { type: 'email', name: 'Email Verification', status: 'disabled' },
    { type: 'backup', name: 'Backup Codes', status: 'enabled', lastUsed: '2024-01-15 09:20:00' },
  ];

  const backupCodes = ['XK78-9J2L', 'M3P6-QR9S', 'T7V2-W4X8', 'B5N9-M2K3', 'L8P1-Q6R4', 'S9T2-V5W7'];

  const handleChangePassword = async (values: any) => {
    try {
      // API call to change password
      await fetch('/api/security/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      message.success('Password changed successfully');
      setShowChangePassword(false);
      
      // Log security event
      notification.success({
        message: 'Password Updated',
        description: 'Your password has been changed successfully.',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      });
    } catch (error) {
      message.error('Failed to change password');
    }
  };

  const handleEnable2FA = async (values: any) => {
    try {
      // API call to enable 2FA
      await fetch('/api/security/enable-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: twoFactorType, ...values }),
      });
      
      message.success('Two-factor authentication enabled successfully');
      setShow2FAModal(false);
      
      if (twoFactorType === 'authenticator') {
        setShowQRCode(true);
      }
      
      notification.success({
        message: '2FA Enabled',
        description: 'Two-factor authentication has been successfully enabled.',
        icon: <SafetyOutlined style={{ color: '#1890ff' }} />,
      });
    } catch (error) {
      message.error('Failed to enable two-factor authentication');
    }
  };

  const handleDeleteAccount = async (values: any) => {
    try {
      // API call to delete account
      await fetch('/api/security/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      message.success('Account deletion initiated. You will receive a confirmation email.');
      setShowDeleteAccount(false);
      
      notification.warning({
        message: 'Account Deletion Requested',
        description: 'Your account deletion request has been received. Check your email for confirmation.',
        icon: <WarningOutlined style={{ color: '#fa8c16' }} />,
        duration: 0,
      });
    } catch (error) {
      message.error('Failed to initiate account deletion');
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      await fetch(`/api/security/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      message.success('Session terminated successfully');
    } catch (error) {
      message.error('Failed to terminate session');
    }
  };

  const handleTerminateAllSessions = async () => {
    try {
      await fetch('/api/security/sessions', {
        method: 'DELETE',
      });
      message.success('All other sessions terminated successfully');
    } catch (error) {
      message.error('Failed to terminate sessions');
    }
  };

  const handleExportSecurityData = async () => {
    try {
      const response = await fetch('/api/security/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-data-${moment().format('YYYY-MM-DD')}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      message.success('Security data exported successfully');
    } catch (error) {
      message.error('Failed to export security data');
    }
  };

  const getStatusColor = (status: SecurityMetric['status']) => {
    switch (status) {
      case 'excellent': return '#52c41a';
      case 'good': return '#1890ff';
      case 'fair': return '#fa8c16';
      case 'poor': return '#f5222d';
      default: return '#d9d9d9';
    }
  };

  const getEventIcon = (type: SecurityEvent['type']) => {
    switch (type) {
      case 'login': return <LockOutlined />;
      case 'password_change': return <KeyOutlined />;
      case '2fa_enabled': return <SafetyOutlined />;
      case 'device_added': return <MobileOutlined />;
      case 'suspicious': return <WarningOutlined />;
      case 'logout': return <LogoutOutlined />;
      default: return <HistoryOutlined />;
    }
  };

  const getEventColor = (status: SecurityEvent['status']) => {
    switch (status) {
      case 'success': return 'green';
      case 'failed': return 'red';
      case 'warning': return 'orange';
      default: return 'blue';
    }
  };

  return (
    <PageContainer
      header={{
        title: 'Security Center',
        subTitle: 'Manage your account security and privacy settings',
        breadcrumb: {
          routes: [
            { path: '/', breadcrumbName: 'Home' },
            { path: '/settings', breadcrumbName: 'Settings' },
            { path: '/settings/security', breadcrumbName: 'Security' },
          ],
        },
        extra: [
          <Button 
            key="export" 
            icon={<DownloadOutlined />}
            onClick={handleExportSecurityData}
          >
            Export Security Data
          </Button>,
        ],
      }}
      tabList={[
        { key: 'overview', tab: 'Security Overview' },
        { key: 'authentication', tab: 'Authentication' },
        { key: 'sessions', tab: 'Active Sessions' },
        { key: 'activity', tab: 'Security Activity' },
        { key: 'privacy', tab: 'Privacy & Data' },
      ]}
      tabActiveKey={activeTab}
      onTabChange={setActiveTab}
      content={
        <Alert
          message="Your account security is excellent. Keep your security settings up to date."
          type="success"
          showIcon
          icon={<LockOutlined />}
          closable
        />
      }
    >
      {activeTab === 'overview' && (
        <ProCard direction="column" ghost gutter={[0, 16]}>
          {/* Security Score & Metrics */}
          <ProCard title="Security Health" headerBordered>
            <Row gutter={[16, 16]}>
              {securityMetrics.map((metric, index) => (
                <Col key={index} xs={24} sm={12} lg={6}>
                  <ProCard
                    hoverable
                    style={{
                      borderLeft: `4px solid ${getStatusColor(metric.status)}`,
                      height: '100%',
                    }}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong>{metric.title}</Text>
                        <Badge
                          status={metric.status === 'excellent' ? 'success' : 
                                 metric.status === 'good' ? 'processing' : 
                                 metric.status === 'fair' ? 'warning' : 'error'}
                        />
                      </div>
                      <Statistic
                        value={metric.value}
                        prefix={
                          <span style={{ color: getStatusColor(metric.status), marginRight: 8 }}>
                            {metric.icon}
                          </span>
                        }
                        valueStyle={{ fontSize: 28, color: getStatusColor(metric.status) }}
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {metric.description}
                      </Text>
                    </Space>
                  </ProCard>
                </Col>
              ))}
            </Row>
          </ProCard>

          {/* Quick Security Actions */}
          <ProCard title="Quick Security Actions" headerBordered>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <ProCard
                  hoverable
                  onClick={() => setShowChangePassword(true)}
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: 32, color: '#1890ff', marginBottom: 12 }}>
                    <KeyOutlined />
                  </div>
                  <Title level={5} style={{ marginBottom: 8 }}>Change Password</Title>
                  <Text type="secondary">Update your account password</Text>
                </ProCard>
              </Col>
              
              <Col xs={24} sm={12} md={8}>
                <ProCard
                  hoverable
                  onClick={() => setShow2FAModal(true)}
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: 32, color: '#52c41a', marginBottom: 12 }}>
                    <SafetyOutlined />
                  </div>
                  <Title level={5} style={{ marginBottom: 8 }}>Two-Factor Auth</Title>
                  <Text type="secondary">Add extra security layer</Text>
                </ProCard>
              </Col>
              
              <Col xs={24} sm={12} md={8}>
                <ProCard
                  hoverable
                  onClick={() => setActiveTab('sessions')}
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: 32, color: '#722ed1', marginBottom: 12 }}>
                    <TeamOutlined />
                  </div>
                  <Title level={5} style={{ marginBottom: 8 }}>Manage Sessions</Title>
                  <Text type="secondary">View and control active logins</Text>
                </ProCard>
              </Col>
              
              <Col xs={24} sm={12} md={8}>
                <ProCard
                  hoverable
                  onClick={() => setActiveTab('activity')}
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: 32, color: '#fa8c16', marginBottom: 12 }}>
                    <HistoryOutlined />
                  </div>
                  <Title level={5} style={{ marginBottom: 8 }}>Security Logs</Title>
                  <Text type="secondary">Review account activity</Text>
                </ProCard>
              </Col>
              
              <Col xs={24} sm={12} md={8}>
                <ProCard
                  hoverable
                  onClick={() => setShowBackupCodes(true)}
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: 32, color: '#f5222d', marginBottom: 12 }}>
                    <DatabaseOutlined />
                  </div>
                  <Title level={5} style={{ marginBottom: 8 }}>Backup Codes</Title>
                  <Text type="secondary">View and regenerate codes</Text>
                </ProCard>
              </Col>
              
              <Col xs={24} sm={12} md={8}>
                <ProCard
                  hoverable
                  onClick={() => setShowDeleteAccount(true)}
                  style={{ 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    border: '1px solid #ff4d4f',
                  }}
                >
                  <div style={{ fontSize: 32, color: '#ff4d4f', marginBottom: 12 }}>
                    <UserDeleteOutlined />
                  </div>
                  <Title level={5} style={{ marginBottom: 8, color: '#ff4d4f' }}>Delete Account</Title>
                  <Text type="secondary">Permanently delete your account</Text>
                </ProCard>
              </Col>
            </Row>
          </ProCard>

          {/* Security Recommendations */}
          <ProCard title="Security Recommendations" headerBordered>
            <List
              dataSource={[
                'Enable two-factor authentication for added security',
                'Use a strong, unique password with at least 12 characters',
                'Review active sessions and log out unused devices',
                'Keep backup codes in a secure location',
                'Update your recovery email and phone number',
              ]}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar size="small" style={{ backgroundColor: index === 0 ? '#52c41a' : '#1890ff' }}>{index + 1}</Avatar>}
                    description={item}
                  />
                  {index === 0 && (
                    <Button type="primary" size="small" onClick={() => setShow2FAModal(true)}>
                      Enable Now
                    </Button>
                  )}
                </List.Item>
              )}
            />
          </ProCard>
        </ProCard>
      )}

      {activeTab === 'authentication' && (
        <ProCard direction="column" ghost gutter={[0, 16]}>
          {/* Password Settings */}
          <ProCard title="Password Security" headerBordered>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={5}>Password Strength</Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Progress
                    percent={85}
                    status="active"
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
                  <Text type="secondary">Last changed: 45 days ago</Text>
                </Space>
              </div>
              
              <Button 
                type="primary" 
                icon={<KeyOutlined />}
                onClick={() => setShowChangePassword(true)}
              >
                Change Password
              </Button>
            </Space>
          </ProCard>

          {/* Two-Factor Authentication */}
          <ProCard title="Two-Factor Authentication" headerBordered>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={5}>Available Methods</Title>
                <List
                  dataSource={twoFactorMethods}
                  renderItem={(method) => (
                    <List.Item
                      actions={[
                        <Tag color={method.status === 'enabled' ? 'success' : 'default'}>
                          {method.status.toUpperCase()}
                        </Tag>,
                        <Button 
                          type="link" 
                          size="small"
                          onClick={() => {
                            if (method.type !== 'backup') {
                              setTwoFactorType(method.type);
                              setShow2FAModal(true);
                            }
                          }}
                        >
                          {method.status === 'enabled' ? 'Manage' : 'Enable'}
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          method.type === 'authenticator' ? <QrcodeOutlined /> :
                          method.type === 'sms' ? <MobileOutlined /> :
                          method.type === 'email' ? <MailOutlined /> :
                          <KeyOutlined />
                        }
                        title={method.name}
                        description={
                          method.lastUsed && (
                            <Text type="secondary">
                              Last used: {moment(method.lastUsed).fromNow()}
                            </Text>
                          )
                        }
                      />
                    </List.Item>
                  )}
                />
              </div>
              
              <Alert
                message="Two-factor authentication adds an extra layer of security to your account."
                description="When enabled, you'll need to provide both your password and a verification code to sign in."
                type="info"
                showIcon
              />
            </Space>
          </ProCard>

          {/* Recovery Options */}
          <ProCard title="Recovery Options" headerBordered>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Title level={5}>Backup Codes</Title>
                <Text type="secondary">
                  Use these one-time codes if you lose access to your 2FA device.
                </Text>
                <Button 
                  type="link" 
                  icon={<DatabaseOutlined />}
                  onClick={() => setShowBackupCodes(true)}
                >
                  View Backup Codes
                </Button>
              </div>
              
              <Divider />
              
              <div>
                <Title level={5}>Recovery Email</Title>
                <Text type="secondary">john.doe@example.com</Text>
                <Button type="link" size="small">Update</Button>
              </div>
              
              <div>
                <Title level={5}>Recovery Phone</Title>
                <Text type="secondary">+1 (555) 123-4567</Text>
                <Button type="link" size="small">Update</Button>
              </div>
            </Space>
          </ProCard>
        </ProCard>
      )}

      {activeTab === 'sessions' && (
        <ProCard title="Active Sessions" headerBordered>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
              message={`You have ${activeSessions.length} active sessions`}
              description="Review all devices that are currently logged into your account."
              type="info"
              showIcon
              action={
                <Popconfirm
                  title="Are you sure you want to terminate all other sessions?"
                  description="This will log you out from all other devices except this one."
                  onConfirm={handleTerminateAllSessions}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger>
                    Terminate All Others
                  </Button>
                </Popconfirm>
              }
            />
            
            <List
              dataSource={activeSessions}
              renderItem={(session) => (
                <List.Item
                  actions={[
                    session.current ? (
                      <Tag color="blue">Current</Tag>
                    ) : (
                      <Popconfirm
                        title="Terminate this session?"
                        description="This will log out the device from your account."
                        onConfirm={() => handleTerminateSession(session.id)}
                      >
                        <Button type="link" danger>
                          Terminate
                        </Button>
                      </Popconfirm>
                    ),
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={session.device.includes('iPhone') || session.device.includes('Mobile') ? 
                              <MobileOutlined /> : <GlobalOutlined />}
                        style={{ backgroundColor: session.current ? '#1890ff' : '#52c41a' }}
                      />
                    }
                    title={
                      <Space>
                        <Text strong>{session.device}</Text>
                        <Tag>{session.browser}</Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">{session.location}</Text>
                        <Text type="secondary">IP: {session.ip}</Text>
                        <Text type="secondary">Last active: {moment(session.lastActive).fromNow()}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Space>
        </ProCard>
      )}

      {activeTab === 'activity' && (
        <ProCard title="Security Activity Log" headerBordered>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={5}>Recent Security Events</Title>
              <Button 
                icon={<DownloadOutlined />}
                onClick={handleExportSecurityData}
              >
                Export Logs
              </Button>
            </div>
            
            <Timeline>
              {securityEvents.map((event) => (
                <Timeline.Item
                  key={event.id}
                  color={getEventColor(event.status)}
                  dot={getEventIcon(event.type)}
                >
                  <Card size="small">
                    <Descriptions size="small" column={2}>
                      <Descriptions.Item label="Event">
                        <Space>
                          <Text strong>{event.description}</Text>
                          <Tag color={getEventColor(event.status)}>
                            {event.status.toUpperCase()}
                          </Tag>
                        </Space>
                      </Descriptions.Item>
                      <Descriptions.Item label="Time">
                        {moment(event.timestamp).format('MMM D, YYYY HH:mm')}
                      </Descriptions.Item>
                      <Descriptions.Item label="Device">
                        {event.device}
                      </Descriptions.Item>
                      <Descriptions.Item label="Location">
                        {event.location}
                      </Descriptions.Item>
                      <Descriptions.Item label="IP Address">
                        <Text code>{event.ip}</Text>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Timeline.Item>
              ))}
            </Timeline>
          </Space>
        </ProCard>
      )}

      {activeTab === 'privacy' && (
        <ProCard direction="column" ghost gutter={[0, 16]}>
          {/* Data Privacy */}
          <ProCard title="Data Privacy Settings" headerBordered>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={5}>Data Collection</Title>
                <Text type="secondary">
                  Control what data we collect and how we use it to improve your experience.
                </Text>
                <List
                  style={{ marginTop: 16 }}
                  dataSource={[
                    { label: 'Usage Analytics', description: 'Help us improve by sharing anonymous usage data', defaultChecked: true },
                    { label: 'Marketing Communications', description: 'Receive emails about new features and updates', defaultChecked: false },
                    { label: 'Personalized Recommendations', description: 'Get personalized order suggestions', defaultChecked: true },
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.label}
                        description={item.description}
                      />
                      <Switch defaultChecked={item.defaultChecked} />
                    </List.Item>
                  )}
                />
              </div>
              
              <Divider />
              
              <div>
                <Title level={5}>Data Export & Deletion</Title>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Button 
                    icon={<DownloadOutlined />}
                    onClick={handleExportSecurityData}
                    block
                  >
                    Export All My Data
                  </Button>
                  <Button 
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => setShowDeleteAccount(true)}
                    block
                  >
                    Request Account Deletion
                  </Button>
                </Space>
              </div>
            </Space>
          </ProCard>

          {/* API Access */}
          <ProCard title="API & Integration Security" headerBordered>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Alert
                message="API Security"
                description="Manage your API keys and integration security settings."
                type="info"
                showIcon
              />
              
              <List
                dataSource={[
                  { name: 'WhatsApp Integration', lastUsed: '2 minutes ago', status: 'active' },
                  { name: 'Payment Gateway', lastUsed: 'Today', status: 'active' },
                  { name: 'Analytics API', lastUsed: '3 days ago', status: 'inactive' },
                ]}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button type="link" size="small">Rotate Key</Button>,
                      <Button type="link" size="small" danger>Revoke</Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={item.name}
                      description={
                        <Space>
                          <Text type="secondary">Last used: {item.lastUsed}</Text>
                          <Tag color={item.status === 'active' ? 'success' : 'default'}>
                            {item.status.toUpperCase()}
                          </Tag>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Space>
          </ProCard>
        </ProCard>
      )}

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={showChangePassword}
        onCancel={() => setShowChangePassword(false)}
        footer={null}
        width={500}
      >
        <ProForm
          layout="vertical"
          onFinish={handleChangePassword}
          submitter={{
            render: (props, dom) => [
              <Button key="cancel" onClick={() => setShowChangePassword(false)}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={() => props.form?.submit?.()}>
                Change Password
              </Button>,
            ],
          }}
        >
          <ProFormText.Password
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Please enter your current password' }]}
            placeholder="Enter current password"
          />
          <ProFormText.Password
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter new password' },
              { min: 8, message: 'Password must be at least 8 characters' },
              { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Must include uppercase, lowercase, and number' },
            ]}
            placeholder="Enter new password"
            fieldProps={{
              iconRender: (visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />),
            }}
          />
          <ProFormText.Password
            name="confirmPassword"
            label="Confirm New Password"
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
            placeholder="Confirm new password"
          />
        </ProForm>
      </Modal>

      {/* Enable 2FA Modal */}
      <Modal
        title="Enable Two-Factor Authentication"
        open={show2FAModal}
        onCancel={() => setShow2FAModal(false)}
        footer={null}
        width={600}
      >
        <Tabs activeKey={twoFactorType} onChange={(key: any) => setTwoFactorType(key)}>
          <Tabs.TabPane tab="Authenticator App" key="authenticator">
            <Space direction="vertical" size="large" style={{ width: '100%', padding: '24px 0' }}>
              <Alert
                message="Scan QR Code"
                description="Use an authenticator app like Google Authenticator or Authy to scan this QR code."
                type="info"
                showIcon
              />
              
              <div style={{ textAlign: 'center' }}>
                <QRCode value="otpauth://totp/YourApp:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=YourApp" />
                <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
                  Secret Key: JBSWY3DPEHPK3PXP
                </Text>
              </div>
              
              <ProForm
                layout="vertical"
                onFinish={handleEnable2FA}
                submitter={{
                  render: (props, dom) => [
                    <Button key="cancel" onClick={() => setShow2FAModal(false)}>
                      Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => props.form?.submit?.()}>
                      Verify and Enable
                    </Button>,
                  ],
                }}
              >
                <ProFormDigit
                  name="verificationCode"
                  label="Verification Code"
                  rules={[{ required: true, message: 'Please enter the verification code' }]}
                  placeholder="Enter 6-digit code"
                  fieldProps={{
                    maxLength: 6,
                  }}
                />
              </ProForm>
            </Space>
          </Tabs.TabPane>
          
          <Tabs.TabPane tab="SMS Verification" key="sms">
            <Space direction="vertical" size="large" style={{ width: '100%', padding: '24px 0' }}>
              <Alert
                message="Phone Number Required"
                description="We'll send verification codes to your mobile phone via SMS."
                type="info"
                showIcon
              />
              
              <ProForm
                layout="vertical"
                onFinish={handleEnable2FA}
                submitter={{
                  render: (props, dom) => [
                    <Button key="cancel" onClick={() => setShow2FAModal(false)}>
                      Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => props.form?.submit?.()}>
                      Send SMS Code
                    </Button>,
                  ],
                }}
              >
                <ProFormText
                  name="phoneNumber"
                  label="Phone Number"
                  rules={[
                    { required: true, message: 'Please enter your phone number' },
                    { pattern: /^\+?[\d\s\-\(\)]+$/, message: 'Please enter a valid phone number' },
                  ]}
                  placeholder="+1 (555) 123-4567"
                />
                <ProFormDigit
                  name="smsCode"
                  label="SMS Verification Code"
                  rules={[{ required: true, message: 'Please enter the SMS code' }]}
                  placeholder="Enter 6-digit code"
                  fieldProps={{
                    maxLength: 6,
                  }}
                />
              </ProForm>
            </Space>
          </Tabs.TabPane>
          
          <Tabs.TabPane tab="Email Verification" key="email">
            <Space direction="vertical" size="large" style={{ width: '100%', padding: '24px 0' }}>
              <Alert
                message="Email Verification"
                description="We'll send verification codes to your registered email address."
                type="info"
                showIcon
              />
              
              <ProForm
                layout="vertical"
                onFinish={handleEnable2FA}
                submitter={{
                  render: (props, dom) => [
                    <Button key="cancel" onClick={() => setShow2FAModal(false)}>
                      Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => props.form?.submit?.()}>
                      Send Email Code
                    </Button>,
                  ],
                }}
              >
                <ProFormText
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' },
                  ]}
                  placeholder="user@example.com"
                />
                <ProFormDigit
                  name="emailCode"
                  label="Email Verification Code"
                  rules={[{ required: true, message: 'Please enter the email code' }]}
                  placeholder="Enter 6-digit code"
                  fieldProps={{
                    maxLength: 6,
                  }}
                />
              </ProForm>
            </Space>
          </Tabs.TabPane>
        </Tabs>
      </Modal>

      {/* Backup Codes Modal */}
      <Modal
        title="Backup Codes"
        open={showBackupCodes}
        onCancel={() => setShowBackupCodes(false)}
        footer={[
          <Button key="print" onClick={() => window.print()}>
            Print Codes
          </Button>,
          <Button key="download" type="primary" onClick={() => {
            const text = backupCodes.join('\n');
            const blob = new Blob([text], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'backup-codes.txt';
            a.click();
          }}>
            Download
          </Button>,
          <Button key="regenerate" danger onClick={() => {
            Modal.confirm({
              title: 'Regenerate Backup Codes?',
              content: 'Your old backup codes will no longer work. Are you sure you want to generate new ones?',
              onOk: () => message.success('New backup codes generated'),
            });
          }}>
            Regenerate
          </Button>,
        ]}
      >
        <Alert
          message="Important"
          description="Save these backup codes in a secure location. Each code can be used only once."
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
        
        <div style={{ 
          background: '#f6ffed', 
          padding: 24, 
          borderRadius: 8,
          textAlign: 'center',
        }}>
          {backupCodes.map((code, index) => (
            <div key={index} style={{ 
              fontSize: 18, 
              fontFamily: 'monospace',
              margin: '8px 0',
              padding: '8px',
              background: 'white',
              borderRadius: 4,
              border: '1px solid #d9d9d9',
            }}>
              {code}
            </div>
          ))}
        </div>
        
        <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
          Store these codes in a password manager or print them out.
        </Text>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        title="Delete Account"
        open={showDeleteAccount}
        onCancel={() => setShowDeleteAccount(false)}
        footer={null}
        width={500}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Alert
            message="Warning: This action cannot be undone"
            description="All your data will be permanently deleted. This includes orders, customers, products, and all account information."
            type="error"
            showIcon
          />
          
          <ProForm
            layout="vertical"
            onFinish={handleDeleteAccount}
            submitter={{
              render: (props, dom) => [
                <Button key="cancel" onClick={() => setShowDeleteAccount(false)}>
                  Cancel
                </Button>,
                <Button 
                  key="submit" 
                  type="primary" 
                  danger
                  onClick={() => props.form?.submit?.()}
                >
                  Delete My Account
                </Button>,
              ],
            }}
          >
            <ProFormText
              name="email"
              label="Confirm Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
                {
                  validator(_, value) {
                    if (!value || value === 'user@example.com') {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Email does not match'));
                  },
                },
              ]}
              placeholder="Enter your email to confirm"
            />
            
            <ProFormText.Password
              name="password"
              label="Current Password"
              rules={[{ required: true, message: 'Please enter your password to confirm' }]}
              placeholder="Enter your password"
            />
            
            <ProFormSwitch
              name="confirm"
              label="I understand this action is irreversible"
              rules={[
                {
                  validator: (_, value) => 
                    value ? Promise.resolve() : Promise.reject(new Error('You must confirm this action')),
                },
              ]}
            />
          </ProForm>
        </Space>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        title="Scan QR Code"
        open={showQRCode}
        onCancel={() => setShowQRCode(false)}
        footer={null}
        width={400}
      >
        <div style={{ textAlign: 'center', padding: 24 }}>
          <QRCode 
            value="otpauth://totp/YourApp:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=YourApp" 
            size={256}
          />
          <Title level={5} style={{ marginTop: 24 }}>
            Scan with Authenticator App
          </Title>
          <Text type="secondary">
            Use Google Authenticator, Microsoft Authenticator, or Authy to scan this QR code.
          </Text>
          <div style={{ 
            background: '#f0f0f0', 
            padding: 12, 
            marginTop: 16,
            borderRadius: 4,
            fontFamily: 'monospace',
          }}>
            JBSWY3DPEHPK3PXP
          </div>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Or enter this secret key manually
          </Text>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default SecuritySettingsPage;