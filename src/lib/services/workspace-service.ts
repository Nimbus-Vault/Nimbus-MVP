import { supabase, formatError } from '../supabase';
import { Workspace } from '@/types';

// Workspace Management Service
export const workspaceService = {
  async getAll(): Promise<Workspace[]> {
    const { data, error } = await supabase.from('workspace').select('*');

    if (error) {
      throw new Error(formatError(error));
    }

    return data.map(ws => ({
      id: ws.id,
      name: ws.name,
      description: ws.description,
      createdBy: ws.created_by,
      createdAt: ws.created_at,
      isPublic: ws.is_public
    }));
  },

  async getById(id: string): Promise<Workspace | null> {
    const { data, error } = await supabase
      .from('workspace')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(formatError(error));
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      createdBy: data.created_by,
      createdAt: data.created_at,
      isPublic: data.is_public
    };
  },

  async create(workspace: Omit<Workspace, 'id' | 'createdAt'>): Promise<Workspace> {
    const { data, error } = await supabase
      .from('workspace')
      .insert({
        name: workspace.name,
        description: workspace.description,
        created_by: workspace.createdBy,
        is_public: workspace.isPublic
      })
      .select()
      .single();

    if (error) {
      throw new Error(formatError(error));
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      createdBy: data.created_by,
      createdAt: data.created_at,
      isPublic: data.is_public
    };
  },

  async update(id: string, workspace: Partial<Workspace>): Promise<Workspace> {
    const { data, error } = await supabase
      .from('workspace')
      .update({
        name: workspace.name,
        description: workspace.description,
        is_public: workspace.isPublic
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(formatError(error));
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      createdBy: data.created_by,
      createdAt: data.created_at,
      isPublic: data.is_public
    };
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('workspace').delete().eq('id', id);

    if (error) {
      throw new Error(formatError(error));
    }

    return true;
  },

  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    // Get workspaces where the user is a member
    const { data, error } = await supabase
      .from('workspace_member')
      .select('workspace_id')
      .eq('user_id', userId);

    if (error) {
      throw new Error(formatError(error));
    }

    if (data.length === 0) {
      return [];
    }

    const workspaceIds = data.map(item => item.workspace_id);

    // Fetch the actual workspaces
    const { data: workspaces, error: wsError } = await supabase
      .from('workspace')
      .select('*')
      .in('id', workspaceIds);

    if (wsError) {
      throw new Error(formatError(wsError));
    }

    return workspaces.map(ws => ({
      id: ws.id,
      name: ws.name,
      description: ws.description,
      createdBy: ws.created_by,
      createdAt: ws.created_at,
      isPublic: ws.is_public
    }));
  }
};