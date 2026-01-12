export type UserRole = 'owner' | 'manager' | 'kitchen';
export type Plan = 'FREE' | 'PRO';

export type CurrentUser = {
  id: number;
  email: string;
  role: UserRole;
  is_active: boolean;

  plan: Plan;
  restaurant_id?: number;
};
