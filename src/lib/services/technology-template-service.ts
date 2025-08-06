import { TechnologyTemplate } from '@/types';
import { isSupabaseConfigured } from '../supabase';
import { supabase } from '../supabase';
import * as templateStorage from '../local-storage-templates';

const TABLE_NAME = 'technology_templates';

async function getAll(): Promise<TechnologyTemplate[]> {
  if (!isSupabaseConfigured()) {
    return templateStorage.getTechnologyTemplates();
  }

  const { data, error } = await supabase.from(TABLE_NAME).select('*');
  if (error) {
    console.error('Error fetching technology templates:', error);
    throw new Error(error.message);
  }
  
  // Map workspace_id to workspaceId
  return data.map(template => ({
    ...template,
    workspaceId: template.workspace_id
  })) as TechnologyTemplate[];
}

async function create(template: Omit<TechnologyTemplate, 'id' | 'createdAt' | 'modifiedAt'>): Promise<TechnologyTemplate> {
  if (!isSupabaseConfigured()) {
    return templateStorage.addTechnologyTemplate(template);
  }
  
  // Add workspace_id to the template data
  const templateData = {
    ...template,
    workspace_id: template.workspaceId // Map workspaceId to workspace_id
  };
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([templateData])
    .select();

  if (error) {
    console.error('Error creating technology template:', error);
    throw new Error(error.message);
  }
  return data[0] as TechnologyTemplate;
}

async function update(id: string, updates: Partial<TechnologyTemplate>): Promise<TechnologyTemplate | null> {
  if (!isSupabaseConfigured()) {
    return templateStorage.updateTechnologyTemplate(id, updates);
  }

  // Map workspaceId to workspace_id for updates
  const updateData = {
    ...updates,
    workspace_id: updates.workspaceId
  };
  // Remove workspaceId from updateData as it's not a valid column
  delete updateData.workspaceId;
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating technology template:', error);
    throw new Error(error.message);
  }
  return data ? data[0] as TechnologyTemplate : null;
}

async function remove(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return templateStorage.deleteTechnologyTemplate(id);
  }

  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);
  
  if (error) {
    console.error('Error deleting technology template:', error);
    throw new Error(error.message);
  }
  return true;
}

export const technologyTemplateService = {
  getAll,
  create,
  update,
  delete: remove,
};
