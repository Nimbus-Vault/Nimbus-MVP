import { BehaviorTemplate } from '@/types';
import { isSupabaseConfigured } from '../supabase';
import { supabase } from '../supabase';
import * as templateStorage from '../local-storage-templates';

const TABLE_NAME = 'behavior_templates';

async function getAll(): Promise<BehaviorTemplate[]> {
  if (!isSupabaseConfigured()) {
    return templateStorage.getBehaviorTemplates();
  }

  const { data, error } = await supabase.from(TABLE_NAME).select('*');
  if (error) {
    console.error('Error fetching behavior templates:', error);
    throw new Error(error.message);
  }
  
  // Map workspace_id to workspaceId
  return data.map(template => ({
    ...template,
    workspaceId: template.workspace_id
  })) as BehaviorTemplate[];
}

async function create(template: Omit<BehaviorTemplate, 'id' | 'createdAt' | 'modifiedAt'>): Promise<BehaviorTemplate> {
  if (!isSupabaseConfigured()) {
    return templateStorage.addBehaviorTemplate(template);
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
    console.error('Error creating behavior template:', error);
    throw new Error(error.message);
  }
  return data[0] as BehaviorTemplate;
}

async function update(id: string, updates: Partial<BehaviorTemplate>): Promise<BehaviorTemplate | null> {
  if (!isSupabaseConfigured()) {
    return templateStorage.updateBehaviorTemplate(id, updates);
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
    console.error('Error updating behavior template:', error);
    throw new Error(error.message);
  }
  return data ? data[0] as BehaviorTemplate : null;
}

async function remove(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return templateStorage.deleteBehaviorTemplate(id);
  }

  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);
  
  if (error) {
    console.error('Error deleting behavior template:', error);
    throw new Error(error.message);
  }
  return true;
}

export const behaviorTemplateService = {
  getAll,
  create,
  update,
  delete: remove,
};
