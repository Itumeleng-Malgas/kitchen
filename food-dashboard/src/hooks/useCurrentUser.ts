import { useInitialState } from './useInitialState';

export const useCurrentUser = () => {
  const { initialState, loading } = useInitialState();

  return {
    user: initialState?.currentUser,
    loading,
    isAuthenticated: !!initialState?.currentUser,
  };
};