import { supabase, formatError } from '../supabase';
import { Methodology, MethodologyCategory, MethodologyWithVulnClass } from '@/types';

// Methodology Management Service
export const methodologyService = {
  async getAllCategories(): Promise<MethodologyCategory[]> {
    const { data, error } = await supabase.from('methodology_category').select('*');

    if (error) {
      throw new Error(formatError(error));
    }

    return data.map(category => ({
      id: category.id,
      workspaceId: category.workspace_id,
      name: category.name,
      descr: category.descr
    }));
  },

  async createCategory(category: Omit<MethodologyCategory, 'id'>): Promise<MethodologyCategory> {
    const { data, error } = await supabase
      .from('methodology_category')
      .insert({
        workspace_id: category.workspaceId,
        name: category.name,
        descr: category.descr
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
      descr: data.descr
    };
  },

  async getAll(): Promise<Methodology[]> {
    const { data, error } = await supabase.from('methodology').select('*');

    if (error) {
      throw new Error(formatError(error));
    }

    return data.map(methodology => ({
      id: methodology.id,
      workspaceId: methodology.workspace_id,
      vulnClassId: methodology.vuln_class_id,
      categoryId: methodology.category_id,
      name: methodology.name,
      description: methodology.description,
      createdBy: methodology.created_by,
      createdAt: methodology.created_at
    }));
  },

  async getById(id: string): Promise<Methodology | null> {
    const { data, error } = await supabase
      .from('methodology')
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
      vulnClassId: data.vuln_class_id,
      categoryId: data.category_id,
      name: data.name,
      description: data.description,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },

  async getByWorkspace(workspaceId: string): Promise<Methodology[]> {
    const { data, error } = await supabase
      .from('methodology')
      .select('*')
      .eq('workspace_id', workspaceId);

    if (error) {
      throw new Error(formatError(error));
    }

    return data.map(methodology => ({
      id: methodology.id,
      workspaceId: methodology.workspace_id,
      vulnClassId: methodology.vuln_class_id,
      categoryId: methodology.category_id,
      name: methodology.name,
      description: methodology.description,
      createdBy: methodology.created_by,
      createdAt: methodology.created_at
    }));
  },

  async create(methodology: Omit<Methodology, 'id' | 'createdAt'>): Promise<Methodology> {
    const { data, error } = await supabase
      .from('methodology')
      .insert({
        workspace_id: methodology.workspaceId,
        vuln_class_id: methodology.vulnClassId,
        category_id: methodology.categoryId,
        name: methodology.name,
        description: methodology.description,
        created_by: methodology.createdBy
      })
      .select()
      .single();

    if (error) {
      throw new Error(formatError(error));
    }

    return {
      id: data.id,
      workspaceId: data.workspace_id,
      vulnClassId: data.vuln_class_id,
      categoryId: data.category_id,
      name: data.name,
      description: data.description,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },

  async update(id: string, methodology: Partial<Methodology>): Promise<Methodology> {
    const { data, error } = await supabase
      .from('methodology')
      .update({
        name: methodology.name,
        description: methodology.description,
        category_id: methodology.categoryId
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
      vulnClassId: data.vuln_class_id,
      categoryId: data.category_id,
      name: data.name,
      description: data.description,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('methodology').delete().eq('id', id);

    if (error) {
      throw new Error(formatError(error));
    }

    return true;
  },

  async getWithDetails(id: string): Promise<MethodologyWithVulnClass | null> {
    const { data, error } = await supabase
      .from('methodology')
      .select(`
        *,
        vuln_class:vuln_class_id(*),
        category:category_id(*)
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
      vulnClassId: data.vuln_class_id,
      categoryId: data.category_id,
      name: data.name,
      description: data.description,
      createdBy: data.created_by,
      createdAt: data.created_at,
      vulnClass: data.vuln_class ? {
        id: data.vuln_class.id,
        workspaceId: data.vuln_class.workspace_id,
        name: data.vuln_class.name,
        severity: data.vuln_class.severity,
        description: data.vuln_class.description,
        createdBy: data.vuln_class.created_by,
        createdAt: data.vuln_class.created_at
      } : undefined,
      category: data.category ? {
        id: data.category.id,
        workspaceId: data.category.workspace_id,
        name: data.category.name,
        descr: data.category.descr
      } : undefined
    };
  }
};