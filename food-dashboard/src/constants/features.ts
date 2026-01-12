import { Plan } from "@/types/auth";

export const featureMatrix: Record<Plan, string[]> = {
  FREE: ['BASIC_DASHBOARD'],
  PRO: ['*'],
};
