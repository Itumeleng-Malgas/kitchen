import { Plan } from "./auth";

export interface Subscription {
  plan: Plan;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  expiresAt?: string;
  features: string[];
}
