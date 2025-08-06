import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';
import { toast } from 'sonner';

interface AppContextData {
  // Auth state
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Auth methods
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  
  // App state
  currentWorkspaceId: string | null;
  setCurrentWorkspaceId: (workspaceId: string | null) => void;
  
  // Configuration
  isSupabaseEnabled: boolean;
}

const AppContext = createContext<AppContextData | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);
  
  const isSupabaseEnabled = isSupabaseConfigured();
  const isAuthenticated = !!user;

  useEffect(() => {
    if (!isSupabaseEnabled) {
      // Mock authentication for local development
      const mockUser = {
        id: 'mock-user-id',
        email: 'demo@example.com',
        user_metadata: { full_name: 'Demo User' }
      } as User;
      
      setUser(mockUser);
      setSession({ user: mockUser } as Session);
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        toast.error('Authentication error');
      }
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (event === 'SIGNED_IN') {
        toast.success('Successfully signed in!');
        // Set the first workspace as the current workspace
        if (session?.user) {
          try {
            const { data: workspaces, error } = await supabase
              .from('workspace')
              .select('id')
              .eq('created_by', session.user.id)
              .limit(1);
            
            if (!error && workspaces && workspaces.length > 0) {
              setCurrentWorkspaceId(workspaces[0].id);
            }
          } catch (error) {
            console.error('Error setting default workspace:', error);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        toast.success('Successfully signed out!');
        setCurrentWorkspaceId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [isSupabaseEnabled]);

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!isSupabaseEnabled) {
      toast.error('Supabase is not configured');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user && !data.session) {
        toast.success('Please check your email for verification link');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to sign up');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseEnabled) {
      // Mock sign in for local development
      const mockUser = {
        id: 'mock-user-id',
        email,
        user_metadata: { full_name: 'Demo User' }
      } as User;
      
      setUser(mockUser);
      setSession({ user: mockUser } as Session);
      toast.success('Successfully signed in! (Local mode)');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Session will be set automatically by the auth state change listener
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (!isSupabaseEnabled) {
      // Mock sign out for local development
      setUser(null);
      setSession(null);
      setCurrentWorkspaceId(null);
      toast.success('Successfully signed out! (Local mode)');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // State will be cleared automatically by the auth state change listener
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AppContextData = {
    user,
    session,
    isAuthenticated,
    isLoading,
    signUp,
    signIn,
    signOut,
    currentWorkspaceId,
    setCurrentWorkspaceId,
    isSupabaseEnabled,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
