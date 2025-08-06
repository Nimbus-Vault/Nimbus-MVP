import { supabase, formatError } from '../supabase';
import { Program, ProgramStatus, ProgramWithPlatform } from '@/types';

// Program Management Service
export const programService = {
  async getAll(): Promise<Program[]> {
    const { data, error } = await supabase.from('program').select('*');

    if (error) {
      throw new Error(formatError(error));
    }

    return data.map(program => ({
      id: program.id,
      workspaceId: program.workspace_id,
      platformId: program.platform_id,
      name: program.name,
      description: program.description,
      programUrl: program.program_url,
      status: program.status as ProgramStatus,
      launchDate: program.launch_date,
      notes: program.notes,
      createdAt: program.created_at,
      updatedAt: program.updated_at
    }));
  },

  async getById(id: string): Promise<Program | null> {
    const { data, error } = await supabase
      .from('program')
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
      platformId: data.platform_id,
      name: data.name,
      description: data.description,
      programUrl: data.program_url,
      status: data.status as ProgramStatus,
      launchDate: data.launch_date,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  async getByWorkspace(workspaceId: string): Promise<Program[]> {
    const { data, error } = await supabase
      .from('program')
      .select('*')
      .eq('workspace_id', workspaceId);

    if (error) {
      throw new Error(formatError(error));
    }

    return data.map(program => ({
      id: program.id,
      workspaceId: program.workspace_id,
      platformId: program.platform_id,
      name: program.name,
      description: program.description,
      programUrl: program.program_url,
      status: program.status as ProgramStatus,
      launchDate: program.launch_date,
      notes: program.notes,
      createdAt: program.created_at,
      updatedAt: program.updated_at
    }));
  },

  async create(program: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>): Promise<Program> {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('program')
      .insert({
        workspace_id: program.workspaceId,
        platform_id: program.platformId,
        name: program.name,
        description: program.description,
        program_url: program.programUrl,
        status: program.status,
        launch_date: program.launchDate,
        notes: program.notes,
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
      platformId: data.platform_id,
      name: data.name,
      description: data.description,
      programUrl: data.program_url,
      status: data.status as ProgramStatus,
      launchDate: data.launch_date,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  async update(id: string, program: Partial<Program>): Promise<Program> {
    const { data, error } = await supabase
      .from('program')
      .update({
        name: program.name,
        description: program.description,
        program_url: program.programUrl,
        status: program.status,
        launch_date: program.launchDate,
        notes: program.notes,
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
      platformId: data.platform_id,
      name: data.name,
      description: data.description,
      programUrl: data.program_url,
      status: data.status as ProgramStatus,
      launchDate: data.launch_date,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('program').delete().eq('id', id);

    if (error) {
      throw new Error(formatError(error));
    }

    return true;
  },

  async getWithPlatform(id: string): Promise<ProgramWithPlatform | null> {
    const { data, error } = await supabase
      .from('program')
      .select(`
        *,
        platform:platform_id(*)
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
      platformId: data.platform_id,
      name: data.name,
      description: data.description,
      programUrl: data.program_url,
      status: data.status as ProgramStatus,
      launchDate: data.launch_date,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      platform: data.platform ? {
        id: data.platform.id,
        workspaceId: data.platform.workspace_id,
        name: data.platform.name,
        platformUrl: data.platform.platform_url,
        description: data.platform.description,
        logoUrl: data.platform.logo_url,
        popularityRank: data.platform.popularity_rank,
        reportTemplate: data.platform.report_template,
        createdAt: data.platform.created_at,
        updatedAt: data.platform.updated_at
      } : undefined
    };
  }
};