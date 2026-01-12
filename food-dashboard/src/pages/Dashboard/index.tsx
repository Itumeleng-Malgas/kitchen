import { useCurrentUser } from '@/hooks/useCurrentUser';
import { PageContainer } from '@ant-design/pro-components';



const HomePage: React.FC = () => {
  const { user } = useCurrentUser();

  return (
    <PageContainer ghost>
        Dashboard Hello { user?.email }
    </PageContainer>
  );
};

export default HomePage;
