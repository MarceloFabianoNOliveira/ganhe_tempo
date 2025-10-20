
import { supabase } from '@/integrations/supabase/client';
import { fetchUserData, getRedirectPath, authenticateWithMockUser } from '@/utils/authUtils';
import { LoginResult } from '@/types/auth';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '@/types/demand';

export const loginWithSupabase = async (
  email: string, 
  password: string,
  setSupabaseUser: (user: SupabaseUser | null) => void,
  setUser: (user: User | null) => void
): Promise<LoginResult> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Erro no login:', error);
      return { success: false };
    }

    if (data.user) {
      setSupabaseUser(data.user);
      const userData = await fetchUserData(data.user);
      if (userData) {
        setUser(userData);
        return { success: true, redirect: getRedirectPath(userData.role) };
      }
    }

    return { success: false };
  } catch (error) {
    console.error('Erro no login:', error);
    return { success: false };
  }
};

export const loginWithMockUser = (
  email: string, 
  password: string,
  setUser: (user: User | null) => void
): LoginResult => {
  const foundUser = authenticateWithMockUser(email, password);
  
  if (foundUser) {
    setUser(foundUser);
    localStorage.setItem('laundry-user', JSON.stringify(foundUser));
    return { success: true, redirect: getRedirectPath(foundUser.role) };
  }
  
  return { success: false };
};

//CÓDIGO QUE EXECUTA O LOGOUT
export const performLogout = async (
  
  setUser: (user: User | null) => void,
  setSupabaseUser: (user: SupabaseUser | null) => void
  
): Promise<void> => {
  await supabase.auth.signOut();
  setUser(null);
  setSupabaseUser(null);
  localStorage.removeItem('laundry-user');
  console.log("1");
  // Redireciona para a tela de login
  //window.location.href = '/';
};
