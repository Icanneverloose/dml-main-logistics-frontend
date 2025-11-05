
import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

// Lazy load components
const Home = lazy(() => import('../pages/home/page'));
const About = lazy(() => import('../pages/about/page'));
const Services = lazy(() => import('../pages/services/page'));
const News = lazy(() => import('../pages/news/page'));
const Contact = lazy(() => import('../pages/contact/page'));
const Track = lazy(() => import('../pages/track/page'));
const Dashboard = lazy(() => import('../pages/dashboard/page'));
const RegisterPackage = lazy(() => import('../pages/register/page'));
const SignIn = lazy(() => import('../pages/auth/signin/page'));
const SignUp = lazy(() => import('../pages/auth/signup/page'));
const NotFound = lazy(() => import('../pages/NotFound'));

// New pages
const Careers = lazy(() => import('../pages/careers/page'));
const Freight = lazy(() => import('../pages/freight/page'));
const Warehousing = lazy(() => import('../pages/warehousing/page'));

// Dashboard pages
const DashboardRegisterPackage = lazy(() => import('../pages/dashboard/register-package/page'));
const DashboardTrackShipment = lazy(() => import('../pages/dashboard/track-shipment/page'));
const DashboardShipmentHistory = lazy(() => import('../pages/dashboard/shipment-history/page'));
const DashboardProfile = lazy(() => import('../pages/dashboard/profile/page'));
const DashboardHelp = lazy(() => import('../pages/dashboard/help/page'));
const DashboardCalculator = lazy(() => import('../pages/dashboard/calculator/page'));

// Admin pages
const AdminDashboardPage = lazy(() => import('../pages/admin/page'));
const AdminShipmentsPage = lazy(() => import('../pages/admin/shipments/page'));
const AdminRegisterShipmentPage = lazy(() => import('../pages/admin/register-shipment/page'));
const AdminContentPage = lazy(() => import('../pages/admin/content/page'));
const AdminReceiptsPage = lazy(() => import('../pages/admin/receipts/page'));
const AdminUsersPage = lazy(() => import('../pages/admin/users/page'));
const AdminLogsPage = lazy(() => import('../pages/admin/logs/page'));
const AdminSettingsPage = lazy(() => import('../pages/admin/settings/page'));
const AdminChatPage = lazy(() => import('../pages/admin/chat/page'));

import AdminFleetPage from '../pages/admin/fleet/page';
import AdminCustomersPage from '../pages/admin/customers/page';
import AdminReportsPage from '../pages/admin/reports/page';

// New import
import SupplyChain from '../pages/supply-chain/page';
import NewsArticle from '../pages/news/article/page';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/services',
    element: <Services />,
  },
  {
    path: '/news',
    element: <News />
  },
  {
    path: '/news/article/:id',
    element: <NewsArticle />
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/track',
    element: <Track />,
  },
  {
    path: '/careers',
    element: <Careers />,
  },
  {
    path: '/freight',
    element: <Freight />,
  },
  {
    path: '/warehousing',
    element: <Warehousing />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/dashboard/register-package',
    element: <DashboardRegisterPackage />,
  },
  {
    path: '/dashboard/track-shipment',
    element: <DashboardTrackShipment />,
  },
  {
    path: '/dashboard/shipment-history',
    element: <DashboardShipmentHistory />,
  },
  {
    path: '/dashboard/profile',
    element: <DashboardProfile />,
  },
  {
    path: '/dashboard/help',
    element: <DashboardHelp />,
  },
  {
    path: '/dashboard/calculator',
    element: <DashboardCalculator />,
  },
  {
    path: '/register',
    element: <RegisterPackage />,
  },
  {
    path: '/auth/signin',
    element: <SignIn />,
  },
  {
    path: '/auth/signup',
    element: <SignUp />,
  },
  {
    path: '/admin/test-connection',
    element: lazy(() => import('../pages/admin/test-connection/page')),
  },
  {
    path: '/admin',
    element: <AdminDashboardPage />
  },
  {
    path: '/admin/register-shipment',
    element: <AdminRegisterShipmentPage />
  },
  {
    path: '/admin/shipments',
    element: <AdminShipmentsPage />
  },
  {
    path: '/admin/fleet',
    element: <AdminFleetPage />
  },
  {
    path: '/admin/customers',
    element: <AdminCustomersPage />
  },
  {
    path: '/admin/reports',
    element: <AdminReportsPage />
  },
  {
    path: '/admin/content',
    element: <AdminContentPage />
  },
  {
    path: '/admin/receipts',
    element: <AdminReceiptsPage />
  },
  {
    path: '/admin/users',
    element: <AdminUsersPage />
  },
  {
    path: '/admin/logs',
    element: <AdminLogsPage />
  },
  {
    path: '/admin/settings',
    element: <AdminSettingsPage />
  },
  {
    path: '/admin/chat',
    element: <AdminChatPage />
  },
  {
    path: '/supply-chain',
    element: <SupplyChain />
  },
  {
    path: '*',
    element: <NotFound />,
  }
];

export default routes;
