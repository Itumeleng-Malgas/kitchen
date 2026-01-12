import { Outlet } from '@umijs/max';

import { swrConfig } from '@/utils/swr';
import { SWRConfig } from 'swr';

const RootWrapper = () => {
  return (
    <SWRConfig value={swrConfig}>
      <Outlet />
    </SWRConfig>
  );
};

export default RootWrapper;
