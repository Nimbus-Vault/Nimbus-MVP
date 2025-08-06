import { FunctionalityTemplate } from '@/types';
import { isSupabaseConfigured } from '../supabase';
import { supabase } from '../supabase';
import * as templateStorage from '../local-storage-templates';

const TABLE_NAME = 'functionality_templates';

async function getAll(): Promise<FunctionalityTemplate[]> {
  if (!isSupabaseConfigured()) {
    return templateStorage.getFunctionalityTemplates();
  }

  const { data, error } = await supabase.from(TABLE_NAME).select('*');
  if (error) {
    console.error('Error fetching functionality templates:', error);
    throw new Error(error.message);
  }
  
  // Map workspace_id to workspaceId
  return data.map(template => ({
    ...template,
    workspaceId: template.workspace_id
  })) as FunctionalityTemplate[];
}

async function create(template: Omit<FunctionalityTemplate, 'id' | 'createdAt' | 'modifiedAt'>): Promise<FunctionalityTemplate> {
  if (!isSupabaseConfigured()) {
    return templateStorage.addFunctionalityTemplate(template);
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
    console.error('Error creating functionality template:', error);
    throw new Error(error.message);
  }
  return data[0] as FunctionalityTemplate;
}

async function update(id: string, updates: Partial<FunctionalityTemplate>): Promise<FunctionalityTemplate | null> {
  if (!isSupabaseConfigured()) {
    return templateStorage.updateFunctionalityTemplate(id, updates);
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
    console.error('Error updating functionality template:', error);
    throw new Error(error.message);
  }
  return data ? data[0] as FunctionalityTemplate : null;
}

async function remove(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return templateStorage.deleteFunctionalityTemplate(id);
  }

  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);
  
  if (error) {
    console.error('Error deleting functionality template:', error);
    throw new Error(error.message);
  }
  return true;
}

export const functionalityTemplateService = {
  getAll,
  create,
  update,
  delete: remove,
};
