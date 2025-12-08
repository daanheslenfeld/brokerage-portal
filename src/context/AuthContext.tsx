import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, getCurrentUser, signIn, signUp, signOut, isMockMode } from '../services/supabase';
import type { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  register: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development without Supabase
const createMockUser = (email: string): User => ({
  id: 'mock-user-id',
  email,
  firstName: 'Test',
  lastName: 'Gebruiker',
  accountType: 'free',
  role: 'customer',
  onboardingCompleted: false,
  onboardingApproved: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // In mock mode, just set loading to false
    if (isMockMode) {
      setState({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    // Check for existing session
    const checkAuth = async () => {
      try {
        const { user } = await getCurrentUser();
        if (user) {
          // Fetch user profile from database
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          setState({
            user: profile || createMockUser(user.email || ''),
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState({ user: null, isAuthenticated: false, isLoading: false });
        }
      } catch {
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setState({
          user: profile || createMockUser(session.user.email || ''),
          isAuthenticated: true,
          isLoading: false,
        });
      } else if (event === 'SIGNED_OUT') {
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login for development
    if (isMockMode) {
      setState({
        user: createMockUser(email),
        isAuthenticated: true,
        isLoading: false,
      });
      return { error: null };
    }

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const register = async (email: string, password: string) => {
    // Mock register for development
    if (isMockMode) {
      setState({
        user: createMockUser(email),
        isAuthenticated: true,
        isLoading: false,
      });
      return { error: null };
    }

    try {
      const { error } = await signUp(email, password);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const logout = async () => {
    await signOut();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  const updateUser = (updates: Partial<User>) => {
    if (state.user) {
      setState((prev) => ({
        ...prev,
        user: { ...prev.user!, ...updates },
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
