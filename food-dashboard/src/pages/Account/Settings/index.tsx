import PageContainer from '@/components/PageContainer';
import styles from './index.less';

const HomePage: React.FC = () => {
  return (
    <PageContainer header={{
      title: "Account Settings"
    }}>
      <div className={styles.container}>
        Account
      </div>
    </PageContainer>
  );
};

export default HomePage;
