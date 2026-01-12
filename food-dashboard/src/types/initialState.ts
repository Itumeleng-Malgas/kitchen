import type { CurrentUser } from '@/types/auth';
import type { Subscription } from '@/types/subscription';

export interface InitialState {
  currentUser?: CurrentUser;
  subscription?: Subscription;
}
