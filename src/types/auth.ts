
import { User } from '@/types/demand';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; redirect?: string }>;
  logout: () => void;
  isLoading: boolean;
  supabaseUser: SupabaseUser | null;
}

export interface LoginResult {
  success: boolean;
  redirect?: string;
}
