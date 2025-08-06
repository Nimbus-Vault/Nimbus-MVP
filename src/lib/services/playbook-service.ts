import { supabase, formatError } from '../supabase';
import { Playbook, PlaybookWithMethodology } from '@/types';

// Playbook Management Service
export const playbookService = {
  async getAll(): Promise<Playbook[]> {
    const { data, error } = await supabase.from('playbook').select('*');

    if (error) {
      throw new Error(formatError(error));
    }

    return data.map(playbook => ({
      id: playbook.id,
      workspaceId: playbook.workspace_id,
      methodologyId: playbook.methodology_id,
      name: playbook.name,
      description: playbook.description,
      contentMd: playbook.content_md,
      diagramMd: playbook.diagram_md,
      contextTags: playbook.context_tags,
      createdBy: playbook.created_by,
      createdAt: playbook.created_at
    }));
  },

  async getById(id: string): Promise<Playbook | null> {
    const { data, error } = await supabase
      .from('playbook')
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
      methodologyId: data.methodology_id,
      name: data.name,
      description: data.description,
      contentMd: data.content_md,
      diagramMd: data.diagram_md,
      contextTags: data.context_tags,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },

  async getByWorkspace(workspaceId: string): Promise<Playbook[]> {
    const { data, error } = await supabase
      .from('playbook')
      .select('*')
      .eq('workspace_id', workspaceId);

    if (error) {
      throw new Error(formatError(error));
    }

    return data.map(playbook => ({
      id: playbook.id,
      workspaceId: playbook.workspace_id,
      methodologyId: playbook.methodology_id,
      name: playbook.name,
      description: playbook.description,
      contentMd: playbook.content_md,
      diagramMd: playbook.diagram_md,
      contextTags: playbook.context_tags,
      createdBy: playbook.created_by,
      createdAt: playbook.created_at
    }));
  },

  async getByMethodology(methodologyId: string): Promise<Playbook[]> {
    const { data, error } = await supabase
      .from('playbook')
      .select('*')
      .eq('methodology_id', methodologyId);

    if (error) {
      throw new Error(formatError(error));
    }

    return data.map(playbook => ({
      id: playbook.id,
      workspaceId: playbook.workspace_id,
      methodologyId: playbook.methodology_id,
      name: playbook.name,
      description: playbook.description,
      contentMd: playbook.content_md,
      diagramMd: playbook.diagram_md,
      contextTags: playbook.context_tags,
      createdBy: playbook.created_by,
      createdAt: playbook.created_at
    }));
  },

  async create(playbook: Omit<Playbook, 'id' | 'createdAt'>): Promise<Playbook> {
    const { data, error } = await supabase
      .from('playbook')
      .insert({
        workspace_id: playbook.workspaceId,
        methodology_id: playbook.methodologyId,
        name: playbook.name,
        description: playbook.description,
        content_md: playbook.contentMd,
        diagram_md: playbook.diagramMd,
        context_tags: playbook.contextTags,
        created_by: playbook.createdBy
      })
      .select()
      .single();

    if (error) {
      throw new Error(formatError(error));
    }

    return {
      id: data.id,
      workspaceId: data.workspace_id,
      methodologyId: data.methodology_id,
      name: data.name,
      description: data.description,
      contentMd: data.content_md,
      diagramMd: data.diagram_md,
      contextTags: data.context_tags,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },

  async update(id: string, playbook: Partial<Playbook>): Promise<Playbook> {
    const { data, error } = await supabase
      .from('playbook')
      .update({
        name: playbook.name,
        description: playbook.description,
        content_md: playbook.contentMd,
        diagram_md: playbook.diagramMd,
        context_tags: playbook.contextTags
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
      methodologyId: data.methodology_id,
      name: data.name,
      description: data.description,
      contentMd: data.content_md,
      diagramMd: data.diagram_md,
      contextTags: data.context_tags,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('playbook').delete().eq('id', id);

    if (error) {
      throw new Error(formatError(error));
    }

    return true;
  },

  async getWithDetails(id: string): Promise<PlaybookWithMethodology | null> {
    const { data, error } = await supabase
      .from('playbook')
      .select(`
        *,
        methodology:methodology_id(*)
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
      methodologyId: data.methodology_id,
      name: data.name,
      description: data.description,
      contentMd: data.content_md,
      diagramMd: data.diagram_md,
      contextTags: data.context_tags,
      createdBy: data.created_by,
      createdAt: data.created_at,
      methodology: data.methodology ? {
        id: data.methodology.id,
        workspaceId: data.methodology.workspace_id,
        vulnClassId: data.methodology.vuln_class_id,
        categoryId: data.methodology.category_id,
        name: data.methodology.name,
        description: data.methodology.description,
        createdBy: data.methodology.created_by,
        createdAt: data.methodology.created_at
      } : undefined
    };
  }
};