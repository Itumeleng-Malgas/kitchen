import { useModel, request } from '@umijs/max';
import { Table, Button, Tag } from 'antd';
import { useOrders } from '@/services/orders';
import RootContainer from '@/wrappers/RootContainer';


export default function Orders() {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  const enableRealtime = currentUser?.plan !== 'FREE';
  //const { orders } = useOrders(currentUser.restaurant_id, enableRealtime);

  //if (!orders) return <div>Loading...</div>;

  const handleAction = async (orderId: number, action: string) => {
    await request(`/orders/actions/${orderId}/${action}`, {
      method: 'POST',
    });
  };


  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Total', dataIndex: 'total_amount', render: (val: number) => `$${val}` },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (val: string) => <Tag color="blue">{val}</Tag>,
    },
    {
      title: 'Actions',
      render: (_: any, record: any) => {
        const actions = [];
        if (currentUser.role === 'kitchen' && record.status === 'PAID') {
          actions.push(<Button onClick={() => handleAction(record.id, 'accept')}>Accept</Button>);
        }
        if (currentUser.role === 'kitchen' && record.status === 'ACCEPTED') {
          actions.push(<Button onClick={() => handleAction(record.id, 'prepare')}>Prepare</Button>);
        }
        if (currentUser.role === 'kitchen' && record.status === 'PREPARING') {
          actions.push(<Button onClick={() => handleAction(record.id, 'ready')}>Ready</Button>);
        }
        if (currentUser.role === 'rider' && record.status === 'READY') {
          actions.push(<Button onClick={() => handleAction(record.id, 'dispatch')}>Dispatch</Button>);
        }
        if (currentUser.role === 'rider' && record.status === 'OUT_FOR_DELIVERY') {
          actions.push(<Button onClick={() => handleAction(record.id, 'complete')}>Complete</Button>);
        }
        return actions;
      },
    },
  ];

  return (
    <RootContainer>
      <Table rowKey="id" columns={columns} /*dataSource={orders}*/ />
    </RootContainer>
  );
}
