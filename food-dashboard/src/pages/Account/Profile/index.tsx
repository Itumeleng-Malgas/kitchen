import PageContainer from '@/components/PageContainer';
import { EllipsisOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Button, Dropdown } from 'antd';

const ExamplePage: React.FC = () => {
  return (
      <PageContainer
        fullHeight={true}
        
        // All original PageContainer props still work
        header={{
          title: 'Business Profile',
          ghost: true,
          extra: [
            <Button key="1" type="primary">
              Edit Profile
            </Button>,
            <Dropdown
              key="dropdown"
              trigger={['click']}
              menu={{
                items: [
                  {
                    label: 'Create new user',
                    key: '1',
                  },
                  {
                    label: 'Create new product',
                    key: '2',
                  },
                ],
              }}
            >
              <Button key="4" style={{ padding: '0 8px' }}>
                <EllipsisOutlined />
              </Button>
            </Dropdown>,
          ],
        }}
        tabBarExtraContent="Business information"
        tabList={[
          {
            tab: 'Business Information',
            key: 'base',
            closable: false,
          },
          {
            tab: 'Subscriptions',
            key: 'subs',
          },
          {
            tab: 'Products management',
            key: 'info',
          },
          {
            tab: 'Users management',
            key: 'users',
          },
        ]}
        ghost={true}
      >
        <ProCard direction="column" ghost gutter={[0, 16]}>
          <ProCard style={{ height: 200 }} />
          <ProCard gutter={16} ghost style={{ height: 200 }}>
            <ProCard colSpan={16} />
            <ProCard colSpan={8} />
          </ProCard>
        </ProCard>
      </PageContainer>
  );
};

export default ExamplePage;