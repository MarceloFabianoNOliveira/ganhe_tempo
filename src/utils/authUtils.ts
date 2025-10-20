
import { User } from '@/types/demand';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { mockUsers } from '@/data/mockUsers';

export const fetchUserData = async (authUser: SupabaseUser): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('system_users')
      .select('*')
      .eq('auth_uid', authUser.id)
      .single();

    if (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }

    if (data) {
      return {
        id: data.id.toString(),
        email: data.email,
        name: data.name,
        role: data.role,
        laundryId: data.laundryId
      };
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return null;
  }
};

export const getRedirectPath = (role: string): string => {
  switch (role) {
    case 'super_admin':
      return '/'; // Super admin vai para painel super admin
    case 'admin':
      return '/'; // Admin vai para dashboard de admin
    case 'manager':
      return '/'; // Gerente vai para dashboard de gerente
    case 'operator':
      return '/'; // Operador vai para dashboard de operador
    default:
      return '/';
  }
};

export const authenticateWithMockUser = (email: string, password: string): User | null => {
  const foundUser = mockUsers.find(u => u.email === email);
  
  if (foundUser && (
    password === 'admin123' ||
    password === 'operador123' ||
    password === 'super123' ||
    password === 'gerente123'
  )) {
    return foundUser;
  }
  
  return null;
};
