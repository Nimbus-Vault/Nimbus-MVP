import { supabase, formatError } from '../supabase';
import { User } from '@/types';

// User Management Service
export const userService = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('user')
      .select('id, email, full_name, created_at, last_login, is_active');

    if (error) {
      throw new Error(formatError(error));
    }

    // Map DB fields to our application types
    return data.map(user => ({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      createdAt: user.created_at,
      lastLogin: user.last_login,
      isActive: user.is_active
    }));
  },

  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('user')
      .select('id, email, full_name, created_at, last_login, is_active')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No data found
      }
      throw new Error(formatError(error));
    }

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      createdAt: data.created_at,
      lastLogin: data.last_login,
      isActive: data.is_active
    };
  },

  async create(email: string, password: string, fullName?: string): Promise<User> {
    // For now, we're using supabase auth to sign up users
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (authError) {
      throw new Error(formatError(authError));
    }

    const user = authData.user;
    if (!user) {
      throw new Error('Failed to create user account');
    }

    // Create a default workspace for the new user
    try {
      const { data: workspaceData, error: workspaceError } = await supabase
        .from('workspace')
        .insert({
          name: `${fullName || email}'s Workspace`,
          description: 'Your personal workspace for cybersecurity testing',
          created_by: user.id,
          is_public: false
        })
        .select()
        .single();

      if (workspaceError) {
        console.error('Failed to create default workspace:', workspaceError);
      } else {
        // Add the user as a member of their own workspace
        const { error: memberError } = await supabase
          .from('workspace_member')
          .insert({
            workspace_id: workspaceData.id,
            user_id: user.id,
            role_id: 'owner' // Assuming 'owner' role exists
          });

        if (memberError) {
          console.error('Failed to add user as workspace member:', memberError);
        }
      }
    } catch (workspaceError) {
      console.error('Error creating default workspace:', workspaceError);
    }

    // Return the created user
    return {
      id: user.id,
      email: user.email || email,
      fullName: user.user_metadata?.full_name || fullName,
      createdAt: user.created_at || new Date().toISOString(),
      isActive: true
    };
  },

  async update(id: string, userData: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('user')
      .update({
        email: userData.email,
        full_name: userData.fullName,
        is_active: userData.isActive
      })
      .eq('id', id)
      .select('id, email, full_name, created_at, last_login, is_active')
      .single();

    if (error) {
      throw new Error(formatError(error));
    }

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      createdAt: data.created_at,
      lastLogin: data.last_login,
      isActive: data.is_active
    };
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('user').delete().eq('id', id);

    if (error) {
      throw new Error(formatError(error));
    }

    return true;
  }
};