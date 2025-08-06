import { isSupabaseConfigured } from './supabase';
import * as localStorage from './data-store';
import * as templateStorage from './local-storage-templates';
import * as supabaseServices from './services';
import { suggestionEngine, type Suggestion, type SuggestionContext } from './suggestion-engine';
import type { Workspace, Program, Asset, VulnClass, Playbook, Methodology, DashboardStats, Activity, TechnologyTemplate, FunctionalityTemplate, BehaviorTemplate } from '@/types';

// Determine which data source to use
const useSupabase = isSupabaseConfigured();

// Workspace operations
export const workspaceAdapter = {
  async getAll(): Promise<Workspace[]> {
    if (useSupabase) {
      return await supabaseServices.workspaceService.getAll();
    }
    return localStorage.getWorkspaces();
  },

  async create(workspace: Omit<Workspace, 'id' | 'createdAt'>): Promise<Workspace> {
    if (useSupabase) {
      return await supabaseServices.workspaceService.create(workspace);
    }
    return localStorage.addWorkspace(workspace);
  },

  async update(id: string, updates: Partial<Workspace>): Promise<Workspace | null> {
    if (useSupabase) {
      return await supabaseServices.workspaceService.update(id, updates);
    }
    return localStorage.updateWorkspace(id, updates);
  },

  async delete(id: string): Promise<boolean> {
    if (useSupabase) {
      return await supabaseServices.workspaceService.delete(id);
    }
    return localStorage.deleteWorkspace(id);
  }
};

// Program operations
export const programAdapter = {
  async getAll(): Promise<Program[]> {
    if (useSupabase) {
      return await supabaseServices.programService.getAll();
    }
    return localStorage.getPrograms();
  },

  async getByWorkspace(workspaceId: string): Promise<Program[]> {
    if (useSupabase) {
      return await supabaseServices.programService.getByWorkspace(workspaceId);
    }
    return localStorage.getProgramsByWorkspace(workspaceId);
  },

  async create(program: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>): Promise<Program> {
    if (useSupabase) {
      return await supabaseServices.programService.create(program);
    }
    return localStorage.addProgram(program);
  },

  async update(id: string, updates: Partial<Program>): Promise<Program | null> {
    if (useSupabase) {
      return await supabaseServices.programService.update(id, updates);
    }
    return localStorage.updateProgram(id, updates);
  },

  async delete(id: string): Promise<boolean> {
    if (useSupabase) {
      return await supabaseServices.programService.delete(id);
    }
    return localStorage.deleteProgram(id);
  }
};

// Asset operations
export const assetAdapter = {
  async getAll(): Promise<Asset[]> {
    if (useSupabase) {
      return await supabaseServices.assetService.getAll();
    }
    return localStorage.getAssets();
  },

  async getByProgram(programId: string): Promise<Asset[]> {
    if (useSupabase) {
      return await supabaseServices.assetService.getByProgram(programId);
    }
    return localStorage.getAssetsByProgram(programId);
  },

  async create(asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Asset> {
    if (useSupabase) {
      return await supabaseServices.assetService.create(asset);
    }
    return localStorage.addAsset(asset);
  },

  async update(id: string, updates: Partial<Asset>): Promise<Asset | null> {
    if (useSupabase) {
      return await supabaseServices.assetService.update(id, updates);
    }
    return localStorage.updateAsset(id, updates);
  },

  async delete(id: string): Promise<boolean> {
    if (useSupabase) {
      return await supabaseServices.assetService.delete(id);
    }
    return localStorage.deleteAsset(id);
  }
};

// Vulnerability Class operations
export const vulnClassAdapter = {
  async getAll(): Promise<VulnClass[]> {
    if (useSupabase) {
      return await supabaseServices.vulnerabilityService.getAll();
    }
    return localStorage.getVulnerabilities();
  },

  async create(vulnClass: Omit<VulnClass, 'id' | 'createdAt'>): Promise<VulnClass> {
    if (useSupabase) {
      return await supabaseServices.vulnerabilityService.create(vulnClass);
    }
    return localStorage.addVulnerability(vulnClass);
  },

  async update(id: string, updates: Partial<VulnClass>): Promise<VulnClass | null> {
    if (useSupabase) {
      return await supabaseServices.vulnerabilityService.update(id, updates);
    }
    return localStorage.updateVulnerability(id, updates);
  },

  async delete(id: string): Promise<boolean> {
    if (useSupabase) {
      return await supabaseServices.vulnerabilityService.delete(id);
    }
    return localStorage.deleteVulnerability(id);
  }
};

// Methodology operations
export const methodologyAdapter = {
  async getAll(): Promise<Methodology[]> {
    if (useSupabase) {
      return await supabaseServices.methodologyService.getAll();
    }
    return localStorage.getMethodologies();
  },

  async create(methodology: Omit<Methodology, 'id' | 'createdAt'>): Promise<Methodology> {
    if (useSupabase) {
      return await supabaseServices.methodologyService.create(methodology);
    }
    return localStorage.addMethodology(methodology);
  },

  async update(id: string, updates: Partial<Methodology>): Promise<Methodology | null> {
    if (useSupabase) {
      return await supabaseServices.methodologyService.update(id, updates);
    }
    return localStorage.updateMethodology(id, updates);
  },

  async delete(id: string): Promise<boolean> {
    if (useSupabase) {
      return await supabaseServices.methodologyService.delete(id);
    }
    return localStorage.deleteMethodology(id);
  }
};

// Playbook operations
export const playbookAdapter = {
  async getAll(): Promise<Playbook[]> {
    if (useSupabase) {
      return await supabaseServices.playbookService.getAll();
    }
    return localStorage.getPlaybooks();
  },

  async create(playbook: Omit<Playbook, 'id' | 'createdAt'>): Promise<Playbook> {
    if (useSupabase) {
      return await supabaseServices.playbookService.create(playbook);
    }
    return localStorage.addPlaybook(playbook);
  },

  async update(id: string, updates: Partial<Playbook>): Promise<Playbook | null> {
    if (useSupabase) {
      return await supabaseServices.playbookService.update(id, updates);
    }
    return localStorage.updatePlaybook(id, updates);
  },

  async delete(id: string): Promise<boolean> {
    if (useSupabase) {
      return await supabaseServices.playbookService.delete(id);
    }
    return localStorage.deletePlaybook(id);
  }
};

// Dashboard operations
export const dashboardAdapter = {
  async getStats(): Promise<DashboardStats> {
    if (useSupabase) {
      // TODO: Implement Supabase dashboard stats
      // For now, fall back to local storage
      return localStorage.getDashboardStats();
    }
    return localStorage.getDashboardStats();
  },

  async getActivities(limit: number = 10): Promise<Activity[]> {
    if (useSupabase) {
      // TODO: Implement Supabase activities
      // For now, fall back to local storage
      return localStorage.getActivities().slice(0, limit);
    }
    return localStorage.getActivities().slice(0, limit);
  }
};

// Helper functions for local storage operations
export const getAssetsByProgram = async (programId: string): Promise<Asset[]> => {
  if (useSupabase) {
    return await supabaseServices.assetService.getByProgram(programId);
  }
  return localStorage.getAssets().filter(asset => asset.programId === programId);
};

export const getProgramsByWorkspace = async (workspaceId: string): Promise<Program[]> => {
  if (useSupabase) {
    return await supabaseServices.programService.getByWorkspace(workspaceId);
  }
  return localStorage.getPrograms().filter(program => program.workspaceId === workspaceId);
};

// Add missing local storage helper functions
export const updateMethodology = async (id: string, updates: Partial<Methodology>): Promise<Methodology | null> => {
  if (useSupabase) {
    return await supabaseServices.methodologyService.update(id, updates);
  }
  return localStorage.updateMethodology ? localStorage.updateMethodology(id, updates) : null;
};

export const deleteMethodology = async (id: string): Promise<boolean> => {
  if (useSupabase) {
    return await supabaseServices.methodologyService.delete(id);
  }
  return localStorage.deleteMethodology ? localStorage.deleteMethodology(id) : false;
};

export const updatePlaybook = async (id: string, updates: Partial<Playbook>): Promise<Playbook | null> => {
  if (useSupabase) {
    return await supabaseServices.playbookService.update(id, updates);
  }
  return localStorage.updatePlaybook ? localStorage.updatePlaybook(id, updates) : null;
};

export const deletePlaybook = async (id: string): Promise<boolean> => {
  if (useSupabase) {
    return await supabaseServices.playbookService.delete(id);
  }
  return localStorage.deletePlaybook ? localStorage.deletePlaybook(id) : false;
};

// Initialize sample data if needed
export const initializeData = async (): Promise<void> => {
  if (!useSupabase) {
    // Initialize local storage data
    if (localStorage.initializeSampleData) {
      localStorage.initializeSampleData();
    }
    // Initialize template data
    templateStorage.initializeSampleTemplateData();
  }
  // For Supabase, we assume the database is set up with schema
  // Sample data can be inserted manually or through migrations
};

// Missing Adapters for Template Entities

// Technology Template operations
export const technologyAdapter = {
  async getAll(): Promise<TechnologyTemplate[]> {
    if (useSupabase) {
      return await supabaseServices.technologyTemplateService.getAll();
    }
    return templateStorage.getTechnologyTemplates();
  },
  async create(technology: Omit<TechnologyTemplate, 'id' | 'createdAt' | 'modifiedAt'>): Promise<TechnologyTemplate> {
    if (useSupabase) {
      return await supabaseServices.technologyTemplateService.create(technology);
    }
    return templateStorage.addTechnologyTemplate(technology);
  },
  async update(id: string, updates: Partial<TechnologyTemplate>): Promise<TechnologyTemplate | null> {
    if (useSupabase) {
      return await supabaseServices.technologyTemplateService.update(id, updates);
    }
    return templateStorage.updateTechnologyTemplate(id, updates);
  },
  async delete(id: string): Promise<boolean> {
    if (useSupabase) {
      return await supabaseServices.technologyTemplateService.delete(id);
    }
    return templateStorage.deleteTechnologyTemplate(id);
  }
};

// Functionality Template operations
export const functionalityAdapter = {
  async getAll(): Promise<FunctionalityTemplate[]> {
    if (useSupabase) {
      return await supabaseServices.functionalityTemplateService.getAll();
    }
    return templateStorage.getFunctionalityTemplates();
  },
  async create(functionality: Omit<FunctionalityTemplate, 'id' | 'createdAt' | 'modifiedAt'>): Promise<FunctionalityTemplate> {
    if (useSupabase) {
      return await supabaseServices.functionalityTemplateService.create(functionality);
    }
    return templateStorage.addFunctionalityTemplate(functionality);
  },
  async update(id: string, updates: Partial<FunctionalityTemplate>): Promise<FunctionalityTemplate | null> {
    if (useSupabase) {
      return await supabaseServices.functionalityTemplateService.update(id, updates);
    }
    return templateStorage.updateFunctionalityTemplate(id, updates);
  },
  async delete(id: string): Promise<boolean> {
    if (useSupabase) {
      return await supabaseServices.functionalityTemplateService.delete(id);
    }
    return templateStorage.deleteFunctionalityTemplate(id);
  }
};

// Behavior Template operations
export const behaviorAdapter = {
  async getAll(): Promise<BehaviorTemplate[]> {
    if (useSupabase) {
      return await supabaseServices.behaviorTemplateService.getAll();
    }
    return templateStorage.getBehaviorTemplates();
  },
  async create(behavior: Omit<BehaviorTemplate, 'id' | 'createdAt' | 'modifiedAt'>): Promise<BehaviorTemplate> {
    if (useSupabase) {
      return await supabaseServices.behaviorTemplateService.create(behavior);
    }
    return templateStorage.addBehaviorTemplate(behavior);
  },
  async update(id: string, updates: Partial<BehaviorTemplate>): Promise<BehaviorTemplate | null> {
    if (useSupabase) {
      return await supabaseServices.behaviorTemplateService.update(id, updates);
    }
    return templateStorage.updateBehaviorTemplate(id, updates);
  },
  async delete(id: string): Promise<boolean> {
    if (useSupabase) {
      return await supabaseServices.behaviorTemplateService.delete(id);
    }
    return templateStorage.deleteBehaviorTemplate(id);
  }
};

// Platform operations
export const platformAdapter = {
  async getAll(workspaceId: string): Promise<any[]> {
    if (useSupabase) {
      return await supabaseServices.platformService.getAll(workspaceId);
    }
    // For localStorage, we'll need to implement this
    return [];
  },
  async create(platform: any): Promise<any> {
    if (useSupabase) {
      return await supabaseServices.platformService.create(platform);
    }
    // For localStorage, we'll need to implement this
    return platform;
  },
  async update(id: string, updates: any): Promise<any> {
    if (useSupabase) {
      return await supabaseServices.platformService.update(id, updates);
    }
    // For localStorage, we'll need to implement this
    return null;
  },
  async delete(id: string): Promise<boolean> {
    if (useSupabase) {
      return await supabaseServices.platformService.delete(id);
    }
    // For localStorage, we'll need to implement this
    return false;
  }
};

// Technique operations
export const techniqueAdapter = {
  async getAll(): Promise<any[]> {
    // TODO: Implement with proper service when available
    return [];
  },
  async create(technique: any): Promise<any> {
    // TODO: Implement with proper service when available
    return technique;
  },
  async update(id: string, updates: any): Promise<any> {
    // TODO: Implement with proper service when available
    return null;
  },
  async delete(id: string): Promise<boolean> {
    // TODO: Implement with proper service when available
    return false;
  }
};

// Payload operations
export const payloadAdapter = {
  async getAll(): Promise<any[]> {
    // TODO: Implement with proper service when available
    return [];
  },
  async create(payload: any): Promise<any> {
    // TODO: Implement with proper service when available
    return payload;
  },
  async update(id: string, updates: any): Promise<any> {
    // TODO: Implement with proper service when available
    return null;
  },
  async delete(id: string): Promise<boolean> {
    // TODO: Implement with proper service when available
    return false;
  }
};

// Atomic Vulnerability operations
export const atomicVulnAdapter = {
  async getAll(): Promise<any[]> {
    // TODO: Implement with proper service when available
    return [];
  },
  async create(atomicVuln: any): Promise<any> {
    // TODO: Implement with proper service when available
    return atomicVuln;
  },
  async update(id: string, updates: any): Promise<any> {
    // TODO: Implement with proper service when available
    return null;
  },
  async delete(id: string): Promise<boolean> {
    // TODO: Implement with proper service when available
    return false;
  }
};

// Logic Flaw operations
export const logicFlawAdapter = {
  async getAll(): Promise<any[]> {
    // TODO: Implement with proper service when available
    return [];
  },
  async create(logicFlaw: any): Promise<any> {
    // TODO: Implement with proper service when available
    return logicFlaw;
  },
  async update(id: string, updates: any): Promise<any> {
    // TODO: Implement with proper service when available
    return null;
  },
  async delete(id: string): Promise<boolean> {
    // TODO: Implement with proper service when available
    return false;
  }
};

// Suggestion Engine operations
export const suggestionAdapter = {
  async generateSuggestions(context: SuggestionContext): Promise<Suggestion[]> {
    try {
      return suggestionEngine.generateSuggestions(context);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      return [];
    }
  },

  async getHighConfidenceSuggestions(suggestions: Suggestion[], threshold = 80): Promise<Suggestion[]> {
    return suggestionEngine.getHighConfidenceSuggestions(suggestions, threshold);
  },

  async filterByType(suggestions: Suggestion[], type: string): Promise<Suggestion[]> {
    return suggestions.filter(s => s.type === type);
  },

  async addRule(rule: any): Promise<void> {
    suggestionEngine.addRule(rule);
  },

  async getRules(): Promise<any[]> {
    return suggestionEngine.getRules();
  }
};

// Export configuration info
export const dataConfig = {
  useSupabase,
  isConfigured: useSupabase,
  source: useSupabase ? 'Supabase' : 'Local Storage'
};
