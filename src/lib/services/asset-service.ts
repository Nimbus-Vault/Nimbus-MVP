import { supabase, formatError } from '../supabase';
import { Asset, AssetWithProgram } from '@/types';

// Asset Management Service
export const assetService = {
  async getAll(): Promise<Asset[]> {
    const { data, error } = await supabase.from('asset').select('*');

    if (error) {
      throw new Error(formatError(error));
    }

    return data.map(asset => ({
      id: asset.id,
      workspaceId: asset.workspace_id,
      programId: asset.program_id,
      name: asset.name,
      assetType: asset.asset_type,
      assetUrl: asset.asset_url,
      discoveredAt: asset.discovered_at,
      lastTestedAt: asset.last_tested_at,
      notesMd: asset.notes_md,
      contextTags: asset.context_tags,
      createdAt: asset.created_at,
      updatedAt: asset.updated_at
    }));
  },

  async getById(id: string): Promise<Asset | null> {
    const { data, error } = await supabase
      .from('asset')
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
      programId: data.program_id,
      name: data.name,
      assetType: data.asset_type,
      assetUrl: data.asset_url,
      discoveredAt: data.discovered_at,
      lastTestedAt: data.last_tested_at,
      notesMd: data.notes_md,
      contextTags: data.context_tags,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  async getByWorkspace(workspaceId: string): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('asset')
      .select('*')
      .eq('workspace_id', workspaceId);

    if (error) {
      throw new Error(formatError(error));
    }

    return data.map(asset => ({
      id: asset.id,
      workspaceId: asset.workspace_id,
      programId: asset.program_id,
      name: asset.name,
      assetType: asset.asset_type,
      assetUrl: asset.asset_url,
      discoveredAt: asset.discovered_at,
      lastTestedAt: asset.last_tested_at,
      notesMd: asset.notes_md,
      contextTags: asset.context_tags,
      createdAt: asset.created_at,
      updatedAt: asset.updated_at
    }));
  },

  async getByProgram(programId: string): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('asset')
      .select('*')
      .eq('program_id', programId);

    if (error) {
      throw new Error(formatError(error));
    }

    return data.map(asset => ({
      id: asset.id,
      workspaceId: asset.workspace_id,
      programId: asset.program_id,
      name: asset.name,
      assetType: asset.asset_type,
      assetUrl: asset.asset_url,
      discoveredAt: asset.discovered_at,
      lastTestedAt: asset.last_tested_at,
      notesMd: asset.notes_md,
      contextTags: asset.context_tags,
      createdAt: asset.created_at,
      updatedAt: asset.updated_at
    }));
  },

  async create(asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Asset> {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('asset')
      .insert({
        workspace_id: asset.workspaceId,
        program_id: asset.programId,
        name: asset.name,
        asset_type: asset.assetType,
        asset_url: asset.assetUrl,
        discovered_at: asset.discoveredAt,
        last_tested_at: asset.lastTestedAt,
        notes_md: asset.notesMd,
        context_tags: asset.contextTags,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();

    if (error) {
      throw new Error(formatError(error));
    }

    return {
      id: data.id,
      workspaceId: data.workspace_id,
      programId: data.program_id,
      name: data.name,
      assetType: data.asset_type,
      assetUrl: data.asset_url,
      discoveredAt: data.discovered_at,
      lastTestedAt: data.last_tested_at,
      notesMd: data.notes_md,
      contextTags: data.context_tags,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  async update(id: string, asset: Partial<Asset>): Promise<Asset> {
    const { data, error } = await supabase
      .from('asset')
      .update({
        name: asset.name,
        asset_type: asset.assetType,
        asset_url: asset.assetUrl,
        discovered_at: asset.discoveredAt,
        last_tested_at: asset.lastTestedAt,
        notes_md: asset.notesMd,
        context_tags: asset.contextTags,
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
      programId: data.program_id,
      name: data.name,
      assetType: data.asset_type,
      assetUrl: data.asset_url,
      discoveredAt: data.discovered_at,
      lastTestedAt: data.last_tested_at,
      notesMd: data.notes_md,
      contextTags: data.context_tags,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('asset').delete().eq('id', id);

    if (error) {
      throw new Error(formatError(error));
    }

    return true;
  },

  async getWithProgram(id: string): Promise<AssetWithProgram | null> {
    const { data, error } = await supabase
      .from('asset')
      .select(`
        *,
        program:program_id(*)
      `)
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
      programId: data.program_id,
      name: data.name,
      assetType: data.asset_type,
      assetUrl: data.asset_url,
      discoveredAt: data.discovered_at,
      lastTestedAt: data.last_tested_at,
      notesMd: data.notes_md,
      contextTags: data.context_tags,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      program: data.program ? {
        id: data.program.id,
        workspaceId: data.program.workspace_id,
        platformId: data.program.platform_id,
        name: data.program.name,
        description: data.program.description,
        programUrl: data.program.program_url,
        status: data.program.status,
        launchDate: data.program.launch_date,
        notes: data.program.notes,
        createdAt: data.program.created_at,
        updatedAt: data.program.updated_at
      } : undefined
    };
  }
};