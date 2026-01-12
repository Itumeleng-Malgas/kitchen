import { CurrentUser } from '@/types/auth';
import { useState } from 'react';

export default function useAuthModel() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  return {
    user,
    setUser,
    clearUser: () => setUser(null),
  };
}
