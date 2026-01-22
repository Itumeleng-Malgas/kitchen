import { useCurrentUser } from '@/hooks/useCurrentUser';
import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';



const HomePage: React.FC = () => {
  const { user } = useCurrentUser();

  return (
    <PageContainer className={styles.container} ghost>
        Dashboard Hello { user?.email }
    </PageContainer>
  );
};

export default HomePage;
