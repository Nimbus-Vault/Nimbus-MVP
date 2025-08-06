import { 
  Workspace, 
  Program, 
  Asset, 
  VulnClass, 
  Methodology, 
  Playbook, 
  ProgramStatus, 
  VulnerabilitySeverity,
  DashboardStats,
  Activity
} from '@/types';

// Local storage keys
const STORAGE_KEYS = {
  WORKSPACES: 'nimbus_workspaces',
  PROGRAMS: 'nimbus_programs', 
  ASSETS: 'nimbus_assets',
  VULNERABILITIES: 'nimbus_vulnerabilities',
  METHODOLOGIES: 'nimbus_methodologies',
  PLAYBOOKS: 'nimbus_playbooks',
  ACTIVITIES: 'nimbus_activities'
} as const;

// Utility functions for local storage
const getFromStorage = <T>(key: string, defaultValue: T[]): T[] => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save to localStorage:`, error);
  }
};

// Generate unique IDs
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Activity logging
const logActivity = (action: string, resource: string, user: string = 'Current User'): void => {
  const activities = getActivities();
  const newActivity: Activity = {
    id: generateId(),
    action,
    resource,
    timestamp: new Date().toISOString(),
    user
  };
  
  activities.unshift(newActivity); // Add to beginning
  saveToStorage(STORAGE_KEYS.ACTIVITIES, activities.slice(0, 50)); // Keep only last 50 activities
};

// Initialize with sample data if empty
const initializeSampleData = (): void => {
  const workspaces = getWorkspaces();
  if (workspaces.length === 0) {
    const sampleWorkspace: Workspace = {
      id: generateId(),
      name: 'Default Workspace',
      description: 'Your primary workspace for cybersecurity testing',
      createdBy: 'user1',
      ownerId: 'user1',
      createdAt: new Date().toISOString(),
      isPublic: false
    };
    saveToStorage(STORAGE_KEYS.WORKSPACES, [sampleWorkspace]);
    
    // Add sample programs
    const samplePrograms: Program[] = [
      {
        id: generateId(),
        workspaceId: sampleWorkspace.id,
        platformId: 'platform1',
        name: 'Example Corp Bug Bounty',
        description: 'Main bug bounty program for Example Corp',
        programUrl: 'https://example.com/bugbounty',
        status: ProgramStatus.Active,
        launchDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateId(),
        workspaceId: sampleWorkspace.id,
        platformId: 'platform1',
        name: 'TestCorp Security Assessment',
        description: 'Private security assessment program',
        status: ProgramStatus.Paused,
        launchDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    saveToStorage(STORAGE_KEYS.PROGRAMS, samplePrograms);
    
    // Add sample assets
    const sampleAssets: Asset[] = [
      {
        id: generateId(),
        workspaceId: sampleWorkspace.id,
        programId: samplePrograms[0].id,
        name: 'api.example.com',
        assetType: 'API Endpoint',
        assetUrl: 'https://api.example.com',
        discoveredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateId(),
        workspaceId: sampleWorkspace.id,
        programId: samplePrograms[0].id,
        name: 'example.com',
        assetType: 'Web Application',
        assetUrl: 'https://example.com',
        discoveredAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    saveToStorage(STORAGE_KEYS.ASSETS, sampleAssets);
    
    // Add sample vulnerabilities
    const sampleVulnerabilities: VulnClass[] = [
      {
        id: generateId(),
        workspaceId: sampleWorkspace.id,
        name: 'Cross-Site Scripting (XSS)',
        severity: VulnerabilitySeverity.High,
        description: 'Stored XSS vulnerability in user comments',
        createdBy: 'user1',
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        workspaceId: sampleWorkspace.id,
        name: 'SQL Injection',
        severity: VulnerabilitySeverity.Critical,
        description: 'SQL injection in login endpoint',
        createdBy: 'user1',
        createdAt: new Date().toISOString()
      }
    ];
    saveToStorage(STORAGE_KEYS.VULNERABILITIES, sampleVulnerabilities);
    
    logActivity('Initialized', 'Sample data created', 'System');
  }
};

// Workspace operations
export const getWorkspaces = (): Workspace[] => {
  return getFromStorage(STORAGE_KEYS.WORKSPACES, []);
};

export const addWorkspace = (workspace: Omit<Workspace, 'id' | 'createdAt'>): Workspace => {
  const workspaces = getWorkspaces();
  const newWorkspace: Workspace = {
    ...workspace,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  workspaces.push(newWorkspace);
  saveToStorage(STORAGE_KEYS.WORKSPACES, workspaces);
  logActivity('Created', `Workspace: ${newWorkspace.name}`);
  return newWorkspace;
};

export const updateWorkspace = (id: string, updates: Partial<Workspace>): Workspace | null => {
  const workspaces = getWorkspaces();
  const index = workspaces.findIndex(w => w.id === id);
  if (index === -1) return null;
  
  workspaces[index] = { ...workspaces[index], ...updates };
  saveToStorage(STORAGE_KEYS.WORKSPACES, workspaces);
  logActivity('Updated', `Workspace: ${workspaces[index].name}`);
  return workspaces[index];
};

export const deleteWorkspace = (id: string): boolean => {
  const workspaces = getWorkspaces();
  const workspace = workspaces.find(w => w.id === id);
  if (!workspace) return false;
  
  const filtered = workspaces.filter(w => w.id !== id);
  saveToStorage(STORAGE_KEYS.WORKSPACES, filtered);
  logActivity('Deleted', `Workspace: ${workspace.name}`);
  return true;
};

// Program operations
export const getPrograms = (): Program[] => {
  return getFromStorage(STORAGE_KEYS.PROGRAMS, []);
};

export const addProgram = (program: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>): Program => {
  const programs = getPrograms();
  const newProgram: Program = {
    ...program,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  programs.push(newProgram);
  saveToStorage(STORAGE_KEYS.PROGRAMS, programs);
  logActivity('Created', `Program: ${newProgram.name}`);
  return newProgram;
};

export const updateProgram = (id: string, updates: Partial<Program>): Program | null => {
  const programs = getPrograms();
  const index = programs.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  programs[index] = { ...programs[index], ...updates, updatedAt: new Date().toISOString() };
  saveToStorage(STORAGE_KEYS.PROGRAMS, programs);
  logActivity('Updated', `Program: ${programs[index].name}`);
  return programs[index];
};

export const deleteProgram = (id: string): boolean => {
  const programs = getPrograms();
  const program = programs.find(p => p.id === id);
  if (!program) return false;
  
  const filtered = programs.filter(p => p.id !== id);
  saveToStorage(STORAGE_KEYS.PROGRAMS, filtered);
  logActivity('Deleted', `Program: ${program.name}`);
  return true;
};

// Asset operations
export const getAssets = (): Asset[] => {
  return getFromStorage(STORAGE_KEYS.ASSETS, []);
};

export const addAsset = (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Asset => {
  const assets = getAssets();
  const newAsset: Asset = {
    ...asset,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  assets.push(newAsset);
  saveToStorage(STORAGE_KEYS.ASSETS, assets);
  logActivity('Created', `Asset: ${newAsset.name}`);
  return newAsset;
};

export const updateAsset = (id: string, updates: Partial<Asset>): Asset | null => {
  const assets = getAssets();
  const index = assets.findIndex(a => a.id === id);
  if (index === -1) return null;
  
  assets[index] = { ...assets[index], ...updates, updatedAt: new Date().toISOString() };
  saveToStorage(STORAGE_KEYS.ASSETS, assets);
  logActivity('Updated', `Asset: ${assets[index].name}`);
  return assets[index];
};

export const deleteAsset = (id: string): boolean => {
  const assets = getAssets();
  const asset = assets.find(a => a.id === id);
  if (!asset) return false;
  
  const filtered = assets.filter(a => a.id !== id);
  saveToStorage(STORAGE_KEYS.ASSETS, filtered);
  logActivity('Deleted', `Asset: ${asset.name}`);
  return true;
};

// Vulnerability operations
export const getVulnerabilities = (): VulnClass[] => {
  return getFromStorage(STORAGE_KEYS.VULNERABILITIES, []);
};

export const addVulnerability = (vulnerability: Omit<VulnClass, 'id' | 'createdAt'>): VulnClass => {
  const vulnerabilities = getVulnerabilities();
  const newVulnerability: VulnClass = {
    ...vulnerability,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  vulnerabilities.push(newVulnerability);
  saveToStorage(STORAGE_KEYS.VULNERABILITIES, vulnerabilities);
  logActivity('Created', `Vulnerability: ${newVulnerability.name}`);
  return newVulnerability;
};

export const updateVulnerability = (id: string, updates: Partial<VulnClass>): VulnClass | null => {
  const vulnerabilities = getVulnerabilities();
  const index = vulnerabilities.findIndex(v => v.id === id);
  if (index === -1) return null;
  
  vulnerabilities[index] = { ...vulnerabilities[index], ...updates };
  saveToStorage(STORAGE_KEYS.VULNERABILITIES, vulnerabilities);
  logActivity('Updated', `Vulnerability: ${vulnerabilities[index].name}`);
  return vulnerabilities[index];
};

export const deleteVulnerability = (id: string): boolean => {
  const vulnerabilities = getVulnerabilities();
  const vulnerability = vulnerabilities.find(v => v.id === id);
  if (!vulnerability) return false;
  
  const filtered = vulnerabilities.filter(v => v.id !== id);
  saveToStorage(STORAGE_KEYS.VULNERABILITIES, filtered);
  logActivity('Deleted', `Vulnerability: ${vulnerability.name}`);
  return true;
};

// Methodology operations
export const getMethodologies = (): Methodology[] => {
  return getFromStorage(STORAGE_KEYS.METHODOLOGIES, []);
};

export const addMethodology = (methodology: Omit<Methodology, 'id' | 'createdAt'>): Methodology => {
  const methodologies = getMethodologies();
  const newMethodology: Methodology = {
    ...methodology,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  methodologies.push(newMethodology);
  saveToStorage(STORAGE_KEYS.METHODOLOGIES, methodologies);
  logActivity('Created', `Methodology: ${newMethodology.name}`);
  return newMethodology;
};

export const updateMethodology = (id: string, updates: Partial<Methodology>): Methodology | null => {
  const methodologies = getMethodologies();
  const index = methodologies.findIndex(m => m.id === id);
  if (index === -1) return null;
  
  methodologies[index] = { ...methodologies[index], ...updates };
  saveToStorage(STORAGE_KEYS.METHODOLOGIES, methodologies);
  logActivity('Updated', `Methodology: ${methodologies[index].name}`);
  return methodologies[index];
};

export const deleteMethodology = (id: string): boolean => {
  const methodologies = getMethodologies();
  const methodology = methodologies.find(m => m.id === id);
  if (!methodology) return false;
  
  const filtered = methodologies.filter(m => m.id !== id);
  saveToStorage(STORAGE_KEYS.METHODOLOGIES, filtered);
  logActivity('Deleted', `Methodology: ${methodology.name}`);
  return true;
};

// Playbook operations  
export const getPlaybooks = (): Playbook[] => {
  return getFromStorage(STORAGE_KEYS.PLAYBOOKS, []);
};

export const addPlaybook = (playbook: Omit<Playbook, 'id' | 'createdAt'>): Playbook => {
  const playbooks = getPlaybooks();
  const newPlaybook: Playbook = {
    ...playbook,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  playbooks.push(newPlaybook);
  saveToStorage(STORAGE_KEYS.PLAYBOOKS, playbooks);
  logActivity('Created', `Playbook: ${newPlaybook.name}`);
  return newPlaybook;
};

export const updatePlaybook = (id: string, updates: Partial<Playbook>): Playbook | null => {
  const playbooks = getPlaybooks();
  const index = playbooks.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  playbooks[index] = { ...playbooks[index], ...updates };
  saveToStorage(STORAGE_KEYS.PLAYBOOKS, playbooks);
  logActivity('Updated', `Playbook: ${playbooks[index].name}`);
  return playbooks[index];
};

export const deletePlaybook = (id: string): boolean => {
  const playbooks = getPlaybooks();
  const playbook = playbooks.find(p => p.id === id);
  if (!playbook) return false;
  
  const filtered = playbooks.filter(p => p.id !== id);
  saveToStorage(STORAGE_KEYS.PLAYBOOKS, filtered);
  logActivity('Deleted', `Playbook: ${playbook.name}`);
  return true;
};

// Helper functions for filtering by relationships
export const getProgramsByWorkspace = (workspaceId: string): Program[] => {
  return getPrograms().filter(program => program.workspaceId === workspaceId);
};

export const getAssetsByProgram = (programId: string): Asset[] => {
  return getAssets().filter(asset => asset.programId === programId);
};

// Export the initialization function
export { initializeSampleData };

// Activity operations
export const getActivities = (): Activity[] => {
  return getFromStorage(STORAGE_KEYS.ACTIVITIES, []);
};

// Dashboard stats calculation
export const getDashboardStats = (): DashboardStats => {
  const workspaces = getWorkspaces();
  const programs = getPrograms();
  const assets = getAssets();
  const vulnerabilities = getVulnerabilities();
  
  const programStats = programs.reduce(
    (acc, program) => {
      acc.total++;
      switch (program.status) {
        case ProgramStatus.Active:
          acc.active++;
          break;
        case ProgramStatus.Paused:
          acc.paused++;
          break;
        case ProgramStatus.Ended:
          acc.ended++;
          break;
      }
      return acc;
    },
    { total: 0, active: 0, paused: 0, ended: 0 }
  );
  
  const vulnerabilityStats = vulnerabilities.reduce(
    (acc, vuln) => {
      acc.total++;
      switch (vuln.severity) {
        case VulnerabilitySeverity.Critical:
          acc.critical++;
          break;
        case VulnerabilitySeverity.High:
          acc.high++;
          break;
        case VulnerabilitySeverity.Medium:
          acc.medium++;
          break;
        case VulnerabilitySeverity.Low:
          acc.low++;
          break;
      }
      return acc;
    },
    { total: 0, critical: 0, high: 0, medium: 0, low: 0 }
  );
  
  return {
    workspaces: workspaces.length,
    programs: programStats,
    assets: assets.length,
    vulnerabilities: vulnerabilityStats
  };
};

// Initialize sample data on first load
if (typeof window !== 'undefined') {
  initializeSampleData();
}
