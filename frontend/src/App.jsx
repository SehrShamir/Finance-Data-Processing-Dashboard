import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import queryClient from './store/queryClient';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TransactionList from './pages/Transactions/TransactionList';
import UserList from './pages/Users/UserList';
import NotFound from './pages/NotFound';
import { ROLES } from './utils/constants';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'transactions', element: <TransactionList /> },
      {
        path: 'users',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <UserList />
          </ProtectedRoute>
        ),
      },
      {
        path: '403',
        element: <NotFound code={403} message="Access denied" />,
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
