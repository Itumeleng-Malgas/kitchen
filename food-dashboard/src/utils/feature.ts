import { featureMatrix } from '@/constants/features';
import { Plan } from '@/types/auth';

export function hasFeature(feature: string): boolean {
  const plan = localStorage.getItem('PLAN') as Plan | null;
  if (!plan) return false;

  const features = featureMatrix[plan] || [];
  return features.includes('*') || features.includes(feature);
}
