import { useCurrentUser } from '@/hooks/useCurrentUser';
import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';
import RootContainer from '@/wrappers/RootContainer';



const HomePage: React.FC = () => {
  const { user } = useCurrentUser();

  return (
    <RootContainer>
        Dashboard Hello { user?.email }
    </RootContainer>
  );
};

export default HomePage;
