
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/demand';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { AuthContextType, LoginResult } from '@/types/auth';
import { fetchUserData } from '@/utils/authUtils';
import { loginWithSupabase, loginWithMockUser, performLogout } from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão inicial
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setSupabaseUser(session.user);
        const userData = await fetchUserData(session.user);
        if (userData) {
          setUser(userData);
        }
      }
      setIsLoading(false);
    };

    getInitialSession();

    // Escutar mudanças na autenticação
    /*const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (session?.user) {
          setSupabaseUser(session.user);
          const userData = await fetchUserData(session.user);
          if (userData) {
            setUser(userData);
            console.log('User data loaded:', userData);
          }
        } else {
          setSupabaseUser(null);
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();*/
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    
    // Try Supabase authentication first
    const supabaseResult = await loginWithSupabase(email, password, setSupabaseUser, setUser);
    
    if (supabaseResult.success) {
      setIsLoading(false);
      return supabaseResult;
    }

    // Fallback to mock users if Supabase authentication fails
    const mockResult = loginWithMockUser(email, password, setUser);
    setIsLoading(false);
    return mockResult;
  };

  const logout = async () => {   
    await performLogout(setUser, setSupabaseUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, supabaseUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
