import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/supabase/authService';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type User = Database['public']['Tables']['profiles']['Row'] & {
  user_id: string;
};

interface AuthState {
  user: User | null;
  session: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initialize: async () => {
        set({ isLoading: true });
        
        // Set up auth state listener
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            // Fetch user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();

            set({
              user: profile,
              session,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              session: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        });

        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          set({
            user: profile,
            session,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await authService.login({ email, password });
          
          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          return { success: true };
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      register: async (email: string, password: string, firstName?: string, lastName?: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await authService.register({
            email,
            password,
            first_name: firstName,
            last_name: lastName,
          });
          
          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          return { success: true };
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      logout: async () => {
        await authService.logout();
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'supabase-auth-storage',
    }
  )
);