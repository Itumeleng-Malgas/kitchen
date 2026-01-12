import { Plan } from '@/types/auth';
import { useInitialState } from './useInitialState';

export const useSubscription = () => {
  const { initialState, loading } = useInitialState();

  return {
    subscription: initialState?.subscription,
    plan: initialState?.subscription?.plan as Plan | undefined,
    loading,
  };
};
