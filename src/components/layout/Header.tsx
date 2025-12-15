import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, PieChart, Search, History } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isLandingPage = location.pathname === '/';

  return (
    <>
      {/* Safe area for notch */}
      <div className="bg-primary" style={{ height: 'env(safe-area-inset-top)' }} />

      <header className="bg-dark-bg border-b border-dark-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <svg className="w-8 h-8 mr-2" viewBox="0 0 48 48" fill="none">
                <path
                  d="M 12 20 Q 12 14 18 14 L 30 14 Q 36 14 36 20 L 36 28 Q 36 34 30 34 L 18 34 Q 12 34 12 28 Z"
                  fill="#28EBCF"
                />
              </svg>
              <span className="text-xl font-bold text-white">PIGG</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {isLandingPage && (
                <>
                  <a href="#features" className="text-gray-300 hover:text-primary transition-colors">
                    Features
                  </a>
                  <a href="#how-it-works" className="text-gray-300 hover:text-primary transition-colors">
                    Hoe het werkt
                  </a>
                  <a href="#pricing" className="text-gray-300 hover:text-primary transition-colors">
                    Tarieven
                  </a>
                </>
              )}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-primary transition-colors flex items-center"
                  >
                    <PieChart className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    to="/etfs"
                    className="text-gray-300 hover:text-primary transition-colors flex items-center"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    ETFs
                  </Link>
                  <Link
                    to="/transactions"
                    className="text-gray-300 hover:text-primary transition-colors flex items-center"
                  >
                    <History className="w-4 h-4 mr-2" />
                    Transacties
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="text-gray-300 hover:text-primary transition-colors flex items-center"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-primary transition-colors flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Uitloggen
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-primary transition-colors"
                  >
                    Inloggen
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-semibold"
                  >
                    Gratis Starten
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-primary transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark-card border-t border-dark-border">
            <div className="px-4 py-4 space-y-3">
              {isLandingPage && (
                <>
                  <a
                    href="#features"
                    className="block text-gray-300 hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    className="block text-gray-300 hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Hoe het werkt
                  </a>
                  <a
                    href="#pricing"
                    className="block text-gray-300 hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tarieven
                  </a>
                </>
              )}

              <hr className="border-dark-border" />

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center text-gray-300 hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <PieChart className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    to="/etfs"
                    className="flex items-center text-gray-300 hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    ETFs
                  </Link>
                  <Link
                    to="/transactions"
                    className="flex items-center text-gray-300 hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <History className="w-4 h-4 mr-2" />
                    Transacties
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center text-gray-300 hover:text-primary transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center text-gray-300 hover:text-primary transition-colors py-2 w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Uitloggen
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-300 hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Inloggen
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center px-4 py-3 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Gratis Starten
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
