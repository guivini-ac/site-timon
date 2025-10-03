import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isConfigured } from '../utils/supabase/client';
import { apiClient } from '../utils/api';
import { useSystemInitialization } from '../utils/initialization';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ data?: any; error?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data?: any; error?: any }>;
  verifyCode: (email: string, code: string) => Promise<{ data?: any; error?: any }>;
  updatePassword: (code: string, newPassword: string) => Promise<{ data?: any; error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { initializeIfNeeded } = useSystemInitialization();

  useEffect(() => {
    // Get initial session and initialize system if needed
    const getSession = async () => {
      try {
        if (!isConfigured) {
          // Em modo demonstração, não há sessão inicial
          console.info('Executando em modo demonstração (Supabase não configurado)');
          setSession(null);
          setUser(null);
        } else {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Error getting session:', error);
          } else {
            setSession(session);
            setUser(session?.user ?? null);
          }
        }

        // Initialize system with default data if needed (funciona mesmo sem Supabase)
        await initializeIfNeeded();
      } catch (error) {
        console.error('Error in getSession or initialization:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      if (!isConfigured) {
        // Modo demonstração - aceita qualquer credencial
        const mockUser = {
          id: 'demo-user',
          email: email,
          user_metadata: { name: 'Usuário Demo' }
        };
        
        setUser(mockUser as any);
        setSession({ user: mockUser, access_token: 'demo-token' } as any);
        
        return { 
          data: { 
            user: mockUser,
            session: { user: mockUser, access_token: 'demo-token' }
          } 
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }

      return { data };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      // Use our backend signup endpoint
      const response = await apiClient.signup(email, password, name);
      
      // After successful signup, sign in the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Auto sign in after signup error:', error);
        return { error };
      }

      return { data: { ...data, signupResponse: response } };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
    } catch (error) {
      console.error('Sign out exception:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        console.error('Reset password error:', error);
        return { error };
      }
      return { data };
    } catch (error) {
      console.error('Reset password exception:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (email: string, code: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'password_reset'
      });
      if (error) {
        console.error('Verify code error:', error);
        return { error };
      }
      return { data };
    } catch (error) {
      console.error('Verify code exception:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (code: string, newPassword: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) {
        console.error('Update password error:', error);
        return { error };
      }
      return { data };
    } catch (error) {
      console.error('Update password exception:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    verifyCode,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};