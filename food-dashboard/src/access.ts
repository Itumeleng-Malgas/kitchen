import type { InitialState } from '@/types/initialState';

export default (initialState: InitialState | undefined) => {
  const user = initialState?.currentUser;

  return {
    isAuthenticated: !!user,

    isOwner: user?.role === 'owner',
    isManager: user?.role === 'manager',
    isKitchen: user?.role === 'kitchen',

    hasPro: user?.plan !== 'FREE',
  };
};
