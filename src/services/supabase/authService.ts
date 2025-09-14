import { supabase } from '@/integrations/supabase/client';

export interface AuthResponse {
  user: any;
  session: any;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<{ data: AuthResponse | null; error: any }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { data: null, error };
      }

      return { 
        data: { 
          user: data.user, 
          session: data.session 
        }, 
        error: null 
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async register(userData: RegisterRequest): Promise<{ data: AuthResponse | null; error: any }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        return { data: null, error };
      }

      return { 
        data: { 
          user: data.user, 
          session: data.session 
        }, 
        error: null 
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async logout(): Promise<{ error: any }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  },

  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return { data: session, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { data: user, error };
    } catch (error) {
      return { data: null, error };
    }
  },
};