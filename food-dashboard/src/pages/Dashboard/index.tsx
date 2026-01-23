import { useCurrentUser } from '@/hooks/useCurrentUser';
import PageContainer from '@/components/PageContainer';

const HomePage: React.FC = () => {
  const { user } = useCurrentUser();

  return (
    <PageContainer>
        Dashboard Hello { user?.email }
    </PageContainer>
  );
};

export default HomePage;