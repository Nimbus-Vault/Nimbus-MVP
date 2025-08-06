import { supabase, formatError } from '../supabase';
import { Platform } from '@/types';

// Platform Management Service
export const platformService = {
  async getAll(workspaceId: string): Promise<Platform[]> {
    const { data, error } = await supabase
      .from('platform')
      .select('*')
      .eq('workspace_id', workspaceId);

    if (error) {
      throw new Error(formatError(error));
    }

    return data.map(platform => ({
      id: platform.id,
      workspaceId: platform.workspace_id,
      name: platform.name,
      platformUrl: platform.platform_url,
      description: platform.description,
      logoUrl: platform.logo_url,
      popularityRank: platform.popularity_rank,
      reportTemplate: platform.report_template,
      createdAt: platform.created_at,
      updatedAt: platform.updated_at
    }));
  },

  async getById(id: string): Promise<Platform | null> {
    const { data, error } = await supabase
      .from('platform')
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
      workspaceId: data.workspace_id,
      name: data.name,
      platformUrl: data.platform_url,
      description: data.description,
      logoUrl: data.logo_url,
      popularityRank: data.popularity_rank,
      reportTemplate: data.report_template,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  async create(platform: Omit<Platform, 'id' | 'createdAt' | 'updatedAt'>): Promise<Platform> {
    const { data, error } = await supabase
      .from('platform')
      .insert({
        workspace_id: platform.workspaceId,
        name: platform.name,
        platform_url: platform.platformUrl,
        description: platform.description,
        logo_url: platform.logoUrl,
        popularity_rank: platform.popularityRank,
        report_template: platform.reportTemplate
      })
      .select()
      .single();

    if (error) {
      throw new Error(formatError(error));
    }

    return {
      id: data.id,
      workspaceId: data.workspace_id,
      name: data.name,
      platformUrl: data.platform_url,
      description: data.description,
      logoUrl: data.logo_url,
      popularityRank: data.popularity_rank,
      reportTemplate: data.report_template,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  async update(id: string, platform: Partial<Platform>): Promise<Platform> {
    const { data, error } = await supabase
      .from('platform')
      .update({
        name: platform.name,
        platform_url: platform.platformUrl,
        description: platform.description,
        logo_url: platform.logoUrl,
        popularity_rank: platform.popularityRank,
        report_template: platform.reportTemplate,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(formatError(error));
    }

    return {
      id: data.id,
      workspaceId: data.workspace_id,
      name: data.name,
      platformUrl: data.platform_url,
      description: data.description,
      logoUrl: data.logo_url,
      popularityRank: data.popularity_rank,
      reportTemplate: data.report_template,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('platform').delete().eq('id', id);

    if (error) {
      throw new Error(formatError(error));
    }

    return true;
  }
};