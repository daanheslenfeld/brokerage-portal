import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Search,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const NAV_ITEMS = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/users', icon: Users, label: 'Gebruikers' },
  { path: '/admin/onboarding', icon: FileCheck, label: 'Onboarding' },
  { path: '/admin/manual-reviews', icon: AlertTriangle, label: 'Manual Reviews' },
  { path: '/admin/settings', icon: Settings, label: 'Instellingen' },
];

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-card border-r border-dark-border transform transition-transform lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-dark-border">
            <div className="flex items-center justify-between">
              <Link to="/admin" className="flex items-center gap-2">
                <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
                  <path
                    d="M 12 20 Q 12 14 18 14 L 30 14 Q 36 14 36 20 L 36 28 Q 36 34 30 34 L 18 34 Q 12 34 12 28 Z"
                    fill="#28EBCF"
                  />
                </svg>
                <div>
                  <span className="font-bold text-white">Admin</span>
                  <span className="text-xs text-gray-500 block">Brokerage Portal</span>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        active
                          ? 'bg-primary/20 text-primary'
                          : 'text-gray-400 hover:text-white hover:bg-dark-surface'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {active && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-dark-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">
                  {user?.firstName?.[0] || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-dark-surface rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Uitloggen</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-dark-card border-b border-dark-border px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">{title}</h1>
                {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Zoeken..."
                  className="w-64 bg-dark-surface border border-dark-border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white bg-dark-surface rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Back to portal */}
              <Link
                to="/dashboard"
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-primary bg-dark-surface rounded-lg transition-colors"
              >
                Naar portal
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
