import React, { useState } from 'react';
import {
  ProTable,
  ProCard,
  ProForm,
  ProFormText,
  ProFormSelect,
} from '@ant-design/pro-components';
import {
  TabletOutlined,
  WifiOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  PoweroffOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Tag,
  Space,
  Modal,
  message,
  Badge,
  Tooltip,
  Popconfirm,
  Progress,
  Typography,
  Row,
  Col,
  Statistic,
  Alert,
} from 'antd';
import type { ProColumns } from '@ant-design/pro-components';

const { Text, Link } = Typography;

interface Device {
  id: string;
  name: string;
  type: 'tablet' | 'kiosk' | 'pos';
  status: 'online' | 'offline' | 'maintenance';
  location: string;
  ipAddress: string;
  lastActive: string;
  softwareVersion: string;
  uptime: number; // in hours
  storage: {
    used: number;
    total: number;
  };
  cpuUsage: number;
  memoryUsage: number;
}

interface DeviceManagementProps {
  data?: Device[];
  loading?: boolean;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({ data, loading }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [form] = ProForm.useForm();

  const mockDevices: Device[] = [
    {
      id: 'DEV-001',
      name: 'Main Counter Kiosk',
      type: 'kiosk',
      status: 'online',
      location: 'Main Entrance',
      ipAddress: '192.168.1.101',
      lastActive: '2024-01-20 14:30:00',
      softwareVersion: '2.1.4',
      uptime: 240,
      storage: {
        used: 45,
        total: 128,
      },
      cpuUsage: 25,
      memoryUsage: 68,
    },
    {
      id: 'DEV-002',
      name: 'Drive-Thru Tablet',
      type: 'tablet',
      status: 'online',
      location: 'Drive-Thru',
      ipAddress: '192.168.1.102',
      lastActive: '2024-01-20 14:25:00',
      softwareVersion: '2.1.3',
      uptime: 215,
      storage: {
        used: 32,
        total: 64,
      },
      cpuUsage: 18,
      memoryUsage: 45,
    },
    {
      id: 'DEV-003',
      name: 'Bar POS Terminal',
      type: 'pos',
      status: 'offline',
      location: 'Bar Area',
      ipAddress: '192.168.1.103',
      lastActive: '2024-01-19 22:15:00',
      softwareVersion: '2.0.9',
      uptime: 0,
      storage: {
        used: 28,
        total: 64,
      },
      cpuUsage: 0,
      memoryUsage: 0,
    },
    {
      id: 'DEV-004',
      name: 'Kitchen Display',
      type: 'kiosk',
      status: 'maintenance',
      location: 'Kitchen',
      ipAddress: '192.168.1.104',
      lastActive: '2024-01-20 10:15:00',
      softwareVersion: '2.1.2',
      uptime: 120,
      storage: {
        used: 58,
        total: 128,
      },
      cpuUsage: 42,
      memoryUsage: 75,
    },
  ];

  const columns: ProColumns<Device>[] = [
    {
      title: 'Device',
      dataIndex: 'name',
      width: 200,
      render: (text, record) => (
        <Space>
          <Badge
            status={
              record.status === 'online' ? 'success' :
              record.status === 'offline' ? 'error' : 'warning'
            }
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: {record.id}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 100,
      render: (text) => (
        <Tag
          color={
            text === 'kiosk' ? 'blue' :
            text === 'tablet' ? 'green' : 'purple'
          }
          icon={<TabletOutlined />}
        >
          {text.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      render: (text) => {
        const statusConfig = {
          online: { color: 'success', text: 'Online', icon: <CheckCircleOutlined /> },
          offline: { color: 'error', text: 'Offline', icon: <ExclamationCircleOutlined /> },
          maintenance: { color: 'warning', text: 'Maintenance', icon: <SyncOutlined /> },
        };
        const config = statusConfig[text as keyof typeof statusConfig];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Location',
      dataIndex: 'location',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      width: 120,
    },
    {
      title: 'Last Active',
      dataIndex: 'lastActive',
      width: 150,
      valueType: 'dateTime',
    },
    {
      title: 'Health',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Storage</Text>
            <Progress
              percent={Math.round((record.storage.used / record.storage.total) * 100)}
              size="small"
              status={
                (record.storage.used / record.storage.total) > 0.9 ? 'exception' :
                (record.storage.used / record.storage.total) > 0.7 ? 'active' : 'normal'
              }
            />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>CPU/Memory</Text>
            <Space size="small">
              <Progress
                percent={record.cpuUsage}
                size="small"
                type="circle"
                width={20}
                format={() => `${record.cpuUsage}%`}
              />
              <Progress
                percent={record.memoryUsage}
                size="small"
                type="circle"
                width={20}
                format={() => `${record.memoryUsage}%`}
              />
            </Space>
          </div>
        </Space>
      ),
    },
    {
      title: 'Actions',
      valueType: 'option',
      width: 120,
      render: (_, record) => [
        <Tooltip key="restart" title="Restart Device">
          <Button
            type="text"
            icon={<PoweroffOutlined />}
            onClick={() => handleRestart(record.id)}
          />
        </Tooltip>,
        <Tooltip key="edit" title="Edit Device">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
        </Tooltip>,
        <Tooltip key="delete" title="Remove Device">
          <Popconfirm
            title="Are you sure to remove this device?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Tooltip>,
      ],
    },
  ];

  const handleRestart = (deviceId: string) => {
    message.loading({ content: 'Restarting device...', key: 'restart' });
    setTimeout(() => {
      message.success({ content: 'Device restarted successfully', key: 'restart' });
    }, 2000);
  };

  const handleEdit = (device: Device) => {
    setSelectedDevice(device);
    form.setFieldsValue(device);
    setModalVisible(true);
  };

  const handleDelete = (deviceId: string) => {
    message.success(`Device ${deviceId} removed successfully`);
  };

  const handleAddDevice = () => {
    setSelectedDevice(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    if (selectedDevice) {
      message.success(`Device ${selectedDevice.id} updated successfully`);
    } else {
      message.success('New device added successfully');
    }
    setModalVisible(false);
  };

  const stats = {
    total: mockDevices.length,
    online: mockDevices.filter(d => d.status === 'online').length,
    offline: mockDevices.filter(d => d.status === 'offline').length,
    storageUsed: mockDevices.reduce((sum, d) => sum + d.storage.used, 0),
    storageTotal: mockDevices.reduce((sum, d) => sum + d.storage.total, 0),
  };

  return (
    <ProCard title="Device Management" extra={
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAddDevice}>
        Add New Device
      </Button>
    }>
      {/* Statistics Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <ProCard>
            <Statistic
              title="Total Devices"
              value={stats.total}
              prefix={<TabletOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </ProCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <ProCard>
            <Statistic
              title="Online"
              value={stats.online}
              valueStyle={{ color: '#52c41a' }}
              suffix={`/ ${stats.total}`}
            />
          </ProCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <ProCard>
            <Statistic
              title="Offline"
              value={stats.offline}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </ProCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <ProCard>
            <Statistic
              title="Storage Used"
              value={stats.storageUsed}
              suffix={`/ ${stats.storageTotal} GB`}
              valueStyle={{ color: '#722ed1' }}
            />
          </ProCard>
        </Col>
      </Row>

      {/* Alerts */}
      {stats.offline > 0 && (
        <Alert
          message={`${stats.offline} device(s) are offline`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" type="link">
              View Details
            </Button>
          }
        />
      )}

      {/* Devices Table */}
      <ProTable<Device>
        columns={columns}
        dataSource={data || mockDevices}
        loading={loading}
        rowKey="id"
        search={false}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        toolBarRender={false}
        options={{
          density: true,
          fullScreen: true,
          reload: () => console.log('reload'),
          setting: true,
        }}
      />

      {/* Add/Edit Device Modal */}
      <Modal
        title={selectedDevice ? 'Edit Device' : 'Add New Device'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <ProForm
          form={form}
          onFinish={handleSubmit}
          submitter={{
            render: (props, doms) => [
              <Button key="cancel" onClick={() => setModalVisible(false)}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={() => props.form?.submit?.()}>
                {selectedDevice ? 'Update' : 'Add'} Device
              </Button>,
            ],
          }}
        >
          <ProFormText
            name="name"
            label="Device Name"
            placeholder="Enter device name"
            rules={[{ required: true, message: 'Please enter device name' }]}
          />
          <ProFormSelect
            name="type"
            label="Device Type"
            options={[
              { value: 'kiosk', label: 'Kiosk' },
              { value: 'tablet', label: 'Tablet' },
              { value: 'pos', label: 'POS Terminal' },
            ]}
            rules={[{ required: true, message: 'Please select device type' }]}
          />
          <ProFormText
            name="location"
            label="Location"
            placeholder="Enter device location"
            rules={[{ required: true, message: 'Please enter location' }]}
          />
          <ProFormText
            name="ipAddress"
            label="IP Address"
            placeholder="Enter IP address"
            rules={[
              { required: true, message: 'Please enter IP address' },
              {
                pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                message: 'Please enter a valid IP address',
              },
            ]}
          />
          <ProFormText
            name="softwareVersion"
            label="Software Version"
            placeholder="Enter software version"
            rules={[{ required: true, message: 'Please enter software version' }]}
          />
        </ProForm>
      </Modal>
    </ProCard>
  );
};

export default DeviceManagement;