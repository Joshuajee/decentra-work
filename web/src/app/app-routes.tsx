import { lazy } from 'react';
import { Navigate, RouteObject, useRoutes } from 'react-router-dom';
import { UiLayout } from './ui/ui-layout';
import ContractFeature from './contracts/contract-feature';
import MilestoneFeature from './contracts/milestone-feature';
import AcceptFeature from './contracts/accept-feature';

const AccountListFeature = lazy(() => import('./account/account-list-feature'));
const AccountDetailFeature = lazy(() => import('./account/account-detail-feature'));
const DashboardFeature = lazy(() => import('./dashboard/dashboard-feature'));

const links: { label: string; path: string }[] = [
  { label: 'Contracts', path: '/contracts' },
  { label: 'Account', path: '/account' },
];

const routes: RouteObject[] = [
  { path: '/account/', element: <AccountListFeature /> },
  { path: '/account/:address', element: <AccountDetailFeature /> },
  { path: '/contracts', element: <ContractFeature /> },
  { path: '/contract/:address', element: <MilestoneFeature /> },
  { path: '/accept/:address', element: <AcceptFeature /> },
];

export function AppRoutes() {
  return (
    <UiLayout links={links}>
      {useRoutes([
        { index: true, element: <Navigate to={'/dashboard'} replace={true} /> },
        { path: '/dashboard', element: <DashboardFeature /> },
        ...routes,
      ])}
    </UiLayout>
  );
}
