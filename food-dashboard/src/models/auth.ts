import { useState } from 'react';

export type UserRole = 'owner' | 'manager' | 'kitchen' | 'rider';
export type UserPlan = 'FREE' | 'PRO' | 'ENTERPRISE';

export type AuthUser = {
  id: number;
  email: string;
  role: UserRole;
  is_active: boolean;

  plan: UserPlan;
  restaurant_id?: number;
};

export default function useAuthModel() {
  const [user, setUser] = useState<AuthUser | null>(null);

  return {
    user,
    setUser,
    clearUser: () => setUser(null),
  };
}
