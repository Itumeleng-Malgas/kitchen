// src/types/claims.ts
import { Plan } from "./auth";

export interface Claims {
  plan: Plan;
  roles: string[];
  features: string[];
}
