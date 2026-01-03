export default (initialState: any) => {
  const user = initialState?.auth?.user;

  return {
    isOwner: user?.role === 'owner',
    isManager: user?.role === 'manager',
    isKitchen: user?.role === 'kitchen',
    isRider: user?.role === 'rider',

    hasPro: user?.plan !== 'FREE',
    hasEnterprise: user?.plan === 'ENTERPRISE',
  };
};
