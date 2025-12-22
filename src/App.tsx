import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ETFDatabasePage } from './pages/dashboard/ETFDatabasePage';
import { PortfolioBuilderPage } from './pages/dashboard/PortfolioBuilderPage';
import { ModelPortfoliosPage } from './pages/dashboard/ModelPortfoliosPage';
import { ModelPortfolioDetailPage } from './pages/dashboard/ModelPortfolioDetailPage';
import { OnboardingPage } from './pages/onboarding/OnboardingPage';
import { ETFDatabasePage as ETFsPage } from './pages/etfs/ETFDatabasePage';
import { ETFDetailPage } from './pages/etfs/ETFDetailPage';
import { TransactionsPage } from './pages/transactions/TransactionsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminOnboardingPage } from './pages/admin/AdminOnboardingPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { ManualReviewsPage } from './pages/admin/ManualReviewsPage';
import { ManualReviewDetailPage } from './pages/admin/ManualReviewDetailPage';

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public Route (redirect to dashboard if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Admin Route component
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin' && user?.role !== 'accountmanager') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/etf-database"
        element={
          <ProtectedRoute>
            <ETFDatabasePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/portfolio-builder"
        element={
          <ProtectedRoute>
            <PortfolioBuilderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/model-portfolios"
        element={
          <ProtectedRoute>
            <ModelPortfoliosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/model-portfolios/:id"
        element={
          <ProtectedRoute>
            <ModelPortfolioDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Onboarding */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />

      {/* ETF Database */}
      <Route
        path="/etfs"
        element={
          <ProtectedRoute>
            <ETFsPage />
          </ProtectedRoute>
        }
      />

      {/* ETF Detail */}
      <Route
        path="/etfs/:isin"
        element={
          <ProtectedRoute>
            <ETFDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Transactions */}
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsersPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/onboarding"
        element={
          <AdminRoute>
            <AdminOnboardingPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/onboarding/:id"
        element={
          <AdminRoute>
            <AdminOnboardingPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <AdminSettingsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/manual-reviews"
        element={
          <AdminRoute>
            <ManualReviewsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/manual-reviews/:id"
        element={
          <AdminRoute>
            <ManualReviewDetailPage />
          </AdminRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <PortfolioProvider>
          <AppRoutes />
        </PortfolioProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
