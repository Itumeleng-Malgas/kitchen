import { useState } from 'react';

export type AuthUser = {
  id: number;
  email: string;
  role: 'owner' | 'manager' | 'kitchen' | 'rider';
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
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
