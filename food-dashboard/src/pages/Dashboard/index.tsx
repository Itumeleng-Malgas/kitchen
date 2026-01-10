import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';
import { useModel } from '@umijs/max';



const HomePage: React.FC = () => {
  const { user } = useModel('auth');

  console.log("User from auth model:", user)

  return (
    <PageContainer ghost>
      <div className={styles.container}>
        Dashboard Hello { user?.email }
      </div>
    </PageContainer>
  );
};

export default HomePage;
