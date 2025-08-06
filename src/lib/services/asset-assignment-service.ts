import { AssetTechnology, AssetFunctionality, AssetBehavior, FunctionalityBehavior, TechnologyBehavior } from '@/types';
import { isSupabaseConfigured } from '../supabase';
import { supabase } from '../supabase';
import * as templateStorage from '../local-storage-templates';

// Asset Technology Assignments
const ASSET_TECH_TABLE = 'asset_technologies';
const ASSET_FUNC_TABLE = 'asset_functionalities';
const ASSET_BEHAVIOR_TABLE = 'asset_behaviors';
const FUNC_BEHAVIOR_TABLE = 'functionality_behaviors';
const TECH_BEHAVIOR_TABLE = 'technology_behaviors';

// Asset Technology Management
async function getAssetTechnologies(assetId: string): Promise<AssetTechnology[]> {
  if (!isSupabaseConfigured()) {
    return templateStorage.getAssetTechnologies(assetId);
  }

  const { data, error } = await supabase
    .from(ASSET_TECH_TABLE)
    .select('*')
    .eq('assetId', assetId);

  if (error) {
    console.error('Error fetching asset technologies:', error);
    throw new Error(error.message);
  }
  return data as AssetTechnology[];
}

async function assignTechnologyToAsset(
  assetId: string,
  technologyTemplateId: string,
  technologyTemplate: any
): Promise<AssetTechnology> {
  const assignment: Omit<AssetTechnology, 'id' | 'assignedAt'> = {
    assetId,
    technologyTemplateId,
    name: technologyTemplate.name,
    vendor: technologyTemplate.vendor,
    category: technologyTemplate.category,
    docUrl: technologyTemplate.docUrl,
    description: technologyTemplate.description,
    defaultConfigs: technologyTemplate.defaultConfigs
  };

  if (!isSupabaseConfigured()) {
    return templateStorage.assignTechnologyToAsset(assignment);
  }

  const { data, error } = await supabase
    .from(ASSET_TECH_TABLE)
    .insert([assignment])
    .select();

  if (error) {
    console.error('Error assigning technology to asset:', error);
    throw new Error(error.message);
  }
  return data[0] as AssetTechnology;
}

async function unassignTechnologyFromAsset(assetId: string, technologyId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return templateStorage.unassignTechnologyFromAsset(assetId, technologyId);
  }

  const { error } = await supabase
    .from(ASSET_TECH_TABLE)
    .delete()
    .eq('assetId', assetId)
    .eq('id', technologyId);

  if (error) {
    console.error('Error unassigning technology from asset:', error);
    throw new Error(error.message);
  }
  return true;
}

// Asset Functionality Management
async function getAssetFunctionalities(assetId: string): Promise<AssetFunctionality[]> {
  if (!isSupabaseConfigured()) {
    return localStorage.getAssetFunctionalities(assetId);
  }

  const { data, error } = await supabase
    .from(ASSET_FUNC_TABLE)
    .select('*')
    .eq('assetId', assetId);

  if (error) {
    console.error('Error fetching asset functionalities:', error);
    throw new Error(error.message);
  }
  return data as AssetFunctionality[];
}

async function assignFunctionalityToAsset(
  assetId: string,
  functionalityTemplateId: string,
  functionalityTemplate: any
): Promise<AssetFunctionality> {
  const assignment: Omit<AssetFunctionality, 'id' | 'assignedAt'> = {
    assetId,
    functionalityTemplateId,
    name: functionalityTemplate.name,
    category: functionalityTemplate.category,
    description: functionalityTemplate.description,
    commonEndpoints: functionalityTemplate.commonEndpoints,
    notes: functionalityTemplate.notes,
    diagramMd: functionalityTemplate.diagramMd,
    commonVectors: functionalityTemplate.commonVectors
  };

  if (!isSupabaseConfigured()) {
    return localStorage.assignFunctionalityToAsset(assignment);
  }

  const { data, error } = await supabase
    .from(ASSET_FUNC_TABLE)
    .insert([assignment])
    .select();

  if (error) {
    console.error('Error assigning functionality to asset:', error);
    throw new Error(error.message);
  }
  return data[0] as AssetFunctionality;
}

async function unassignFunctionalityFromAsset(assetId: string, functionalityId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return localStorage.unassignFunctionalityFromAsset(assetId, functionalityId);
  }

  const { error } = await supabase
    .from(ASSET_FUNC_TABLE)
    .delete()
    .eq('assetId', assetId)
    .eq('id', functionalityId);

  if (error) {
    console.error('Error unassigning functionality from asset:', error);
    throw new Error(error.message);
  }
  return true;
}

// Asset Behavior Management
async function getAssetBehaviors(assetId: string): Promise<AssetBehavior[]> {
  if (!isSupabaseConfigured()) {
    return localStorage.getAssetBehaviors(assetId);
  }

  const { data, error } = await supabase
    .from(ASSET_BEHAVIOR_TABLE)
    .select('*')
    .eq('assetId', assetId);

  if (error) {
    console.error('Error fetching asset behaviors:', error);
    throw new Error(error.message);
  }
  return data as AssetBehavior[];
}

async function assignBehaviorToAsset(
  assetId: string,
  behaviorTemplateId: string,
  behaviorTemplate: any
): Promise<AssetBehavior> {
  const assignment: Omit<AssetBehavior, 'id' | 'assignedAt'> = {
    assetId,
    behaviorTemplateId,
    name: behaviorTemplate.name,
    description: behaviorTemplate.description,
    isGood: behaviorTemplate.isGood
  };

  if (!isSupabaseConfigured()) {
    return localStorage.assignBehaviorToAsset(assignment);
  }

  const { data, error } = await supabase
    .from(ASSET_BEHAVIOR_TABLE)
    .insert([assignment])
    .select();

  if (error) {
    console.error('Error assigning behavior to asset:', error);
    throw new Error(error.message);
  }
  return data[0] as AssetBehavior;
}

async function unassignBehaviorFromAsset(assetId: string, behaviorId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return localStorage.unassignBehaviorFromAsset(assetId, behaviorId);
  }

  const { error } = await supabase
    .from(ASSET_BEHAVIOR_TABLE)
    .delete()
    .eq('assetId', assetId)
    .eq('id', behaviorId);

  if (error) {
    console.error('Error unassigning behavior from asset:', error);
    throw new Error(error.message);
  }
  return true;
}

// Functionality Behavior Management
async function getFunctionalityBehaviors(functionalityId: string): Promise<FunctionalityBehavior[]> {
  if (!isSupabaseConfigured()) {
    return localStorage.getFunctionalityBehaviors(functionalityId);
  }

  const { data, error } = await supabase
    .from(FUNC_BEHAVIOR_TABLE)
    .select('*')
    .eq('functionalityId', functionalityId);

  if (error) {
    console.error('Error fetching functionality behaviors:', error);
    throw new Error(error.message);
  }
  return data as FunctionalityBehavior[];
}

async function assignBehaviorToFunctionality(
  functionalityId: string,
  behaviorTemplateId: string,
  behaviorTemplate: any
): Promise<FunctionalityBehavior> {
  const assignment: Omit<FunctionalityBehavior, 'id' | 'assignedAt'> = {
    functionalityId,
    behaviorTemplateId,
    name: behaviorTemplate.name,
    description: behaviorTemplate.description,
    isGood: behaviorTemplate.isGood
  };

  if (!isSupabaseConfigured()) {
    return localStorage.assignBehaviorToFunctionality(assignment);
  }

  const { data, error } = await supabase
    .from(FUNC_BEHAVIOR_TABLE)
    .insert([assignment])
    .select();

  if (error) {
    console.error('Error assigning behavior to functionality:', error);
    throw new Error(error.message);
  }
  return data[0] as FunctionalityBehavior;
}

// Technology Behavior Management
async function getTechnologyBehaviors(technologyId: string): Promise<TechnologyBehavior[]> {
  if (!isSupabaseConfigured()) {
    return localStorage.getTechnologyBehaviors(technologyId);
  }

  const { data, error } = await supabase
    .from(TECH_BEHAVIOR_TABLE)
    .select('*')
    .eq('technologyId', technologyId);

  if (error) {
    console.error('Error fetching technology behaviors:', error);
    throw new Error(error.message);
  }
  return data as TechnologyBehavior[];
}

async function assignBehaviorToTechnology(
  technologyId: string,
  behaviorTemplateId: string,
  behaviorTemplate: any
): Promise<TechnologyBehavior> {
  const assignment: Omit<TechnologyBehavior, 'id' | 'assignedAt'> = {
    technologyId,
    behaviorTemplateId,
    name: behaviorTemplate.name,
    description: behaviorTemplate.description,
    isGood: behaviorTemplate.isGood
  };

  if (!isSupabaseConfigured()) {
    return localStorage.assignBehaviorToTechnology(assignment);
  }

  const { data, error } = await supabase
    .from(TECH_BEHAVIOR_TABLE)
    .insert([assignment])
    .select();

  if (error) {
    console.error('Error assigning behavior to technology:', error);
    throw new Error(error.message);
  }
  return data[0] as TechnologyBehavior;
}

export const assetAssignmentService = {
  // Asset Technology
  getAssetTechnologies,
  assignTechnologyToAsset,
  unassignTechnologyFromAsset,
  
  // Asset Functionality
  getAssetFunctionalities,
  assignFunctionalityToAsset,
  unassignFunctionalityFromAsset,
  
  // Asset Behavior
  getAssetBehaviors,
  assignBehaviorToAsset,
  unassignBehaviorFromAsset,
  
  // Functionality Behavior
  getFunctionalityBehaviors,
  assignBehaviorToFunctionality,
  
  // Technology Behavior
  getTechnologyBehaviors,
  assignBehaviorToTechnology,
};
