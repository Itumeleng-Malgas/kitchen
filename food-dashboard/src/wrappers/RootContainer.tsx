import { PageContainer } from '@ant-design/pro-components';
import { Outlet } from '@umijs/max';



const RootContainer: React.FC<{ children?: React.ReactNode }> = ({ children }) => {

  return (
    <PageContainer style={{ height: 'calc(100vh - 48px)' }} ghost>
        {children}
    </PageContainer>
  );
};

export default RootContainer;
