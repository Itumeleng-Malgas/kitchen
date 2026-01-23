import React from 'react';
import { ProTable } from '@ant-design/pro-components';
import { Button, Tag, Space, Tooltip, Badge, Statistic } from 'antd';
import { DownloadOutlined, EyeOutlined, FilePdfOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';

interface BillingHistoryProps {
  data?: any[];
  loading?: boolean;
}

const BillingHistory: React.FC<BillingHistoryProps> = ({ data, loading }) => {
  const columns: ProColumns<any>[] = [
    {
      title: 'Invoice ID',
      dataIndex: 'id',
      width: 120,
      render: (text) => <code>{text}</code>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      width: 100,
      valueType: 'date',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: 120,
      render: (text) => (
        <Statistic
          value={text}
          prefix="$"
          valueStyle={{ fontSize: 14, fontWeight: 'bold' }}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 100,
      render: (text) => {
        const statusConfig: Record<string, any> = {
          paid: { color: 'success', text: 'Paid' },
          pending: { color: 'processing', text: 'Pending' },
          failed: { color: 'error', text: 'Failed' },
          refunded: { color: 'default', text: 'Refunded' },
        };
        const config = statusConfig[text] || { color: 'default', text };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      width: 150,
      render: (text) => (
        <Space>
          {text === 'google_pay' && <GoogleOutlined />}
          {text === 'credit_card' && <CreditCardOutlined />}
          {text === 'bank_transfer' && <BankOutlined />}
          <span>
            {text === 'google_pay' && 'Google Pay'}
            {text === 'credit_card' && 'Credit Card'}
            {text === 'bank_transfer' && 'Bank Transfer'}
          </span>
        </Space>
      ),
    },
    {
      title: 'Actions',
      valueType: 'option',
      width: 120,
      render: (_, record) => [
        <Tooltip key="view" title="View Invoice">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => console.log('View', record)}
          />
        </Tooltip>,
        <Tooltip key="download" title="Download PDF">
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => console.log('Download', record)}
          />
        </Tooltip>,
      ],
    },
  ];

  const mockData = [
    {
      id: 'INV-2024-001',
      date: '2024-01-15',
      description: 'Professional Plan - January 2024',
      amount: 79.00,
      status: 'paid',
      paymentMethod: 'google_pay',
    },
    {
      id: 'INV-2023-012',
      date: '2023-12-15',
      description: 'Professional Plan - December 2023',
      amount: 79.00,
      status: 'paid',
      paymentMethod: 'credit_card',
    },
    {
      id: 'INV-2023-011',
      date: '2023-11-15',
      description: 'Professional Plan - November 2023',
      amount: 79.00,
      status: 'paid',
      paymentMethod: 'bank_transfer',
    },
    {
      id: 'INV-2023-010',
      date: '2023-10-15',
      description: 'Starter to Professional Upgrade',
      amount: 50.00,
      status: 'paid',
      paymentMethod: 'google_pay',
    },
  ];

  return (
    <ProTable
      headerTitle="Billing History"
      tooltip="Your subscription payment history"
      search={false}
      columns={columns}
      dataSource={data || mockData}
      loading={loading}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
      }}
      toolBarRender={() => [
        <Button key="export" icon={<DownloadOutlined />}>
          Export All
        </Button>,
        <Button key="upcoming" type="primary">
          View Upcoming Invoice
        </Button>,
      ]}
      summary={() => (
        <ProTable.Summary.Row>
          <ProTable.Summary.Cell index={0} colSpan={3}>
            <strong>Total Paid (Last 12 months)</strong>
          </ProTable.Summary.Cell>
          <ProTable.Summary.Cell index={1}>
            <Statistic
              value={316.00}
              prefix="$"
              valueStyle={{ fontSize: 16, fontWeight: 'bold', color: '#1890ff' }}
            />
          </ProTable.Summary.Cell>
          <ProTable.Summary.Cell index={2} colSpan={3} />
        </ProTable.Summary.Row>
      )}
    />
  );
};

export default BillingHistory;