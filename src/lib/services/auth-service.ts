import { supabase, formatError } from '../supabase';
import { User } from '@/types';

// Auth Service - Wraps Supabase Auth
export const authService = {
  async signIn(email: string, password: string): Promise<{ user: User; session: any }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(formatError(error));
    }

    if (!data.user) {
      throw new Error('Authentication failed');
    }

    // Update last login time
    await supabase
      .from('user')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);

    // Return user data in our format
    return {
      user: {
        id: data.user.id,
        email: data.user.email || '',
        fullName: data.user.user_metadata?.full_name || null,
        createdAt: data.user.created_at || '',
        lastLogin: new Date().toISOString(),
        isActive: true
      },
      session: data.session
    };
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(formatError(error));
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email || '',
      fullName: data.user.user_metadata?.full_name || null,
      createdAt: data.user.created_at || '',
      lastLogin: data.user.last_login_at || null,
      isActive: true
    };
  },

  async getSession(): Promise<any> {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      return null;
    }
    return data.session;
  }
};