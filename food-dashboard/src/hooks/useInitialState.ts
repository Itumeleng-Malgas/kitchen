import { InitialState } from '@/types/initialState';
import { useModel } from '@umijs/max';

export const useInitialState = () => {
  return useModel('@@initialState') as {
    initialState?: InitialState;
    loading: boolean;
  };
};
