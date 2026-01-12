import type { FC } from 'react';
import { Navigate, Outlet, useAccess, useRouteProps} from '@umijs/max';
import { Plan } from '@/types/auth';

const PlanGuard: FC = () => {
  const routeProps = useRouteProps<{ requiredPlan?: Plan }>();
  const access = useAccess();

  const requiredPlan = routeProps?.requiredPlan;

  if (!access.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPlan === 'PRO' && !access.hasPro) {
    return <Navigate to="/upgrade" replace />;
  }

  return <Outlet />;
};

export default PlanGuard;
