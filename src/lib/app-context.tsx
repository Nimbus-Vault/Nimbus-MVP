import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User,
  Workspace,
  Program,
  Asset,
  VulnClass,
  Methodology,
  Playbook,
  DashboardStats,
  Activity
} from '@/types';

// Simplified context without complex services for now
// import { isSupabaseConfigured } from './supabase';

// Define the app context interface
interface AppContextData {
  // Auth and user state
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  useSupabase: boolean;
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  
  // Workspace management
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  createWorkspace: (workspace: Omit<Workspace, 'id' | 'createdAt'>) => Promise<Workspace>;
  updateWorkspace: (id: string, workspace: Partial<Workspace>) => Promise<Workspace>;
  deleteWorkspace: (id: string) => Promise<boolean>;
  
  // Program management
  programs: Program[];
  createProgram: (program: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Program>;
  updateProgram: (id: string, program: Partial<Program>) => Promise<Program>;
  deleteProgram: (id: string) => Promise<boolean>;
  
  // Asset management
  assets: Asset[];
  createAsset: (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Asset>;
  updateAsset: (id: string, asset: Partial<Asset>) => Promise<Asset>;
  deleteAsset: (id: string) => Promise<boolean>;
  
  // Vulnerability management
  vulnerabilities: VulnClass[];
  createVulnerability: (vuln: Omit<VulnClass, 'id' | 'createdAt'>) => Promise<VulnClass>;
  updateVulnerability: (id: string, vuln: Partial<VulnClass>) => Promise<VulnClass>;
  deleteVulnerability: (id: string) => Promise<boolean>;
  
  // Methodology management
  methodologies: Methodology[];
  createMethodology: (method: Omit<Methodology, 'id' | 'createdAt'>) => Promise<Methodology>;
  updateMethodology: (id: string, method: Partial<Methodology>) => Promise<Methodology>;
  deleteMethodology: (id: string) => Promise<boolean>;
  
  // Playbook management
  playbooks: Playbook[];
  createPlaybook: (playbook: Omit<Playbook, 'id' | 'createdAt'>) => Promise<Playbook>;
  updatePlaybook: (id: string, playbook: Partial<Playbook>) => Promise<Playbook>;
  deletePlaybook: (id: string) => Promise<boolean>;
  
  // Dashboard data
  dashboardStats: DashboardStats | null;
  recentActivity: Activity[];
  
  // Utility functions
  refreshData: () => Promise<void>;
}

// Create the context
const AppContext = createContext<AppContextData | undefined>(undefined);

// Custom hook to use the app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Mock dashboard stats for demo
const initialDashboardStats: DashboardStats = {
  workspaces: 0,
  programs: {
    total: 0,
    active: 0,
    paused: 0,
    ended: 0
  },
  assets: 0,
  vulnerabilities: {
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  }
};

// Mock activity data for demo
const initialActivity: Activity[] = [];

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Simplified - no Supabase for now
  const [useSupabase] = useState<boolean>(false);
  
  // Auth and user state - simplified for demo
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Start with false for demo
  
  // Data state
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<VulnClass[]>([]);
  const [methodologies, setMethodologies] = useState<Methodology[]>([]);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(initialDashboardStats);
  const [recentActivity, setRecentActivity] = useState<Activity[]>(initialActivity);
  
  // Check for existing auth on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        if (useSupabase) {
          // Use Supabase auth
          const user = await authService.getCurrentUser();
          if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true);
            await refreshData();
          }
        } else {
          // Use localStorage fallback
          const storedUser = userStorage.getCurrentUser();
          if (storedUser) {
            setCurrentUser(storedUser);
            setIsAuthenticated(true);
            await refreshData();
          }
        }
      } catch (error) {
        console.error('Error during authentication initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, [useSupabase]);
  
  // Refresh all data
  const refreshData = async () => {
    if (!currentUser) return;
    
    try {
      let workspacesData: Workspace[] = [];
      let programsData: Program[] = [];
      let assetsData: Asset[] = [];
      let vulnerabilitiesData: VulnClass[] = [];
      let methodologiesData: Methodology[] = [];
      let playbooksData: Playbook[] = [];
      
      if (useSupabase) {
        // Fetch data from Supabase
        if (currentWorkspace) {
          workspacesData = await workspaceService.getUserWorkspaces(currentUser.id);
          programsData = await programService.getByWorkspace(currentWorkspace.id);
          assetsData = await assetService.getByWorkspace(currentWorkspace.id);
          vulnerabilitiesData = await vulnerabilityService.getByWorkspace(currentWorkspace.id);
          methodologiesData = await methodologyService.getByWorkspace(currentWorkspace.id);
          playbooksData = await playbookService.getByWorkspace(currentWorkspace.id);
        } else {
          workspacesData = await workspaceService.getUserWorkspaces(currentUser.id);
          if (workspacesData.length > 0) {
            const firstWorkspace = workspacesData[0];
            setCurrentWorkspace(firstWorkspace);
            
            programsData = await programService.getByWorkspace(firstWorkspace.id);
            assetsData = await assetService.getByWorkspace(firstWorkspace.id);
            vulnerabilitiesData = await vulnerabilityService.getByWorkspace(firstWorkspace.id);
            methodologiesData = await methodologyService.getByWorkspace(firstWorkspace.id);
            playbooksData = await playbookService.getByWorkspace(firstWorkspace.id);
          }
        }
      } else {
        // Use localStorage
        workspacesData = workspaceStorage.getAll();
        
        if (currentWorkspace) {
          programsData = programStorage.getByWorkspaceId(currentWorkspace.id);
          assetsData = assetStorage.getByWorkspaceId(currentWorkspace.id);
          vulnerabilitiesData = vulnerabilityStorage.getByWorkspaceId(currentWorkspace.id);
          methodologiesData = methodologyStorage.getByWorkspaceId(currentWorkspace.id);
          playbooksData = playbookStorage.getByWorkspaceId(currentWorkspace.id);
        } else if (workspacesData.length > 0) {
          const firstWorkspace = workspacesData[0];
          setCurrentWorkspace(firstWorkspace);
          
          programsData = programStorage.getByWorkspaceId(firstWorkspace.id);
          assetsData = assetStorage.getByWorkspaceId(firstWorkspace.id);
          vulnerabilitiesData = vulnerabilityStorage.getByWorkspaceId(firstWorkspace.id);
          methodologiesData = methodologyStorage.getByWorkspaceId(firstWorkspace.id);
          playbooksData = playbookStorage.getByWorkspaceId(firstWorkspace.id);
        }
      }
      
      setWorkspaces(workspacesData);
      setPrograms(programsData);
      setAssets(assetsData);
      setVulnerabilities(vulnerabilitiesData);
      setMethodologies(methodologiesData);
      setPlaybooks(playbooksData);
      
      // Update dashboard stats
      const stats: DashboardStats = {
        workspaces: workspacesData.length,
        programs: {
          total: programsData.length,
          active: programsData.filter(p => p.status === 'Active').length,
          paused: programsData.filter(p => p.status === 'Paused').length,
          ended: programsData.filter(p => p.status === 'Ended').length
        },
        assets: assetsData.length,
        vulnerabilities: {
          total: vulnerabilitiesData.length,
          critical: vulnerabilitiesData.filter(v => v.severity === 'Critical').length,
          high: vulnerabilitiesData.filter(v => v.severity === 'High').length,
          medium: vulnerabilitiesData.filter(v => v.severity === 'Medium').length,
          low: vulnerabilitiesData.filter(v => v.severity === 'Low').length
        }
      };
      
      setDashboardStats(stats);
      
      // Create some mock activity data
      const mockActivity: Activity[] = [
        {
          id: '1',
          action: 'Added new asset',
          resource: assetsData.length > 0 ? assetsData[0].name : 'Unknown asset',
          timestamp: new Date().toISOString(),
          user: currentUser.fullName || currentUser.email
        },
        {
          id: '2',
          action: 'Updated program',
          resource: programsData.length > 0 ? programsData[0].name : 'Unknown program',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: currentUser.fullName || currentUser.email
        },
        {
          id: '3',
          action: 'Created workspace',
          resource: workspacesData.length > 0 ? workspacesData[0].name : 'Unknown workspace',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          user: currentUser.fullName || currentUser.email
        }
      ];
      
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };
  
  // Auth actions
  const login = async (email: string, password: string) => {
    try {
      if (useSupabase) {
        const { user, session } = await authService.signIn(email, password);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        // Use localStorage auth
        const user = userStorage.signIn(email, password);
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
      await refreshData();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      if (useSupabase) {
        await authService.signOut();
      } else {
        userStorage.signOut();
      }
      setCurrentUser(null);
      setIsAuthenticated(false);
      setCurrentWorkspace(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };
  
  const register = async (email: string, password: string, fullName?: string) => {
    try {
      if (useSupabase) {
        const user = await userService.create(email, password, fullName);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        const user = userStorage.register(email, password, fullName);
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  
  // Workspace management
  const createWorkspace = async (workspace: Omit<Workspace, 'id' | 'createdAt'>): Promise<Workspace> => {
    try {
      let createdWorkspace: Workspace;
      
      if (useSupabase) {
        createdWorkspace = await workspaceService.create(workspace);
      } else {
        createdWorkspace = workspaceStorage.create(workspace);
      }
      
      setWorkspaces(prev => [...prev, createdWorkspace]);
      await refreshData();
      return createdWorkspace;
    } catch (error) {
      console.error('Error creating workspace:', error);
      throw error;
    }
  };
  
  const updateWorkspace = async (id: string, workspace: Partial<Workspace>): Promise<Workspace> => {
    try {
      let updatedWorkspace: Workspace;
      
      if (useSupabase) {
        updatedWorkspace = await workspaceService.update(id, workspace);
      } else {
        updatedWorkspace = workspaceStorage.update(id, workspace);
      }
      
      setWorkspaces(prev => prev.map(w => w.id === id ? updatedWorkspace : w));
      
      // Update current workspace if it's the one being modified
      if (currentWorkspace?.id === id) {
        setCurrentWorkspace(updatedWorkspace);
      }
      
      return updatedWorkspace;
    } catch (error) {
      console.error('Error updating workspace:', error);
      throw error;
    }
  };
  
  const deleteWorkspace = async (id: string): Promise<boolean> => {
    try {
      let success: boolean;
      
      if (useSupabase) {
        success = await workspaceService.delete(id);
      } else {
        success = workspaceStorage.delete(id);
      }
      
      if (success) {
        setWorkspaces(prev => prev.filter(w => w.id !== id));
        
        // Clear current workspace if it's the one being deleted
        if (currentWorkspace?.id === id) {
          setCurrentWorkspace(null);
        }
        
        await refreshData();
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting workspace:', error);
      throw error;
    }
  };
  
  // Program management
  const createProgram = async (program: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>): Promise<Program> => {
    try {
      let createdProgram: Program;
      
      if (useSupabase) {
        createdProgram = await programService.create(program);
      } else {
        createdProgram = programStorage.create(program);
      }
      
      setPrograms(prev => [...prev, createdProgram]);
      await refreshData();
      return createdProgram;
    } catch (error) {
      console.error('Error creating program:', error);
      throw error;
    }
  };
  
  const updateProgram = async (id: string, program: Partial<Program>): Promise<Program> => {
    try {
      let updatedProgram: Program;
      
      if (useSupabase) {
        updatedProgram = await programService.update(id, program);
      } else {
        updatedProgram = programStorage.update(id, program);
      }
      
      setPrograms(prev => prev.map(p => p.id === id ? updatedProgram : p));
      return updatedProgram;
    } catch (error) {
      console.error('Error updating program:', error);
      throw error;
    }
  };
  
  const deleteProgram = async (id: string): Promise<boolean> => {
    try {
      let success: boolean;
      
      if (useSupabase) {
        success = await programService.delete(id);
      } else {
        success = programStorage.delete(id);
      }
      
      if (success) {
        setPrograms(prev => prev.filter(p => p.id !== id));
        await refreshData();
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting program:', error);
      throw error;
    }
  };
  
  // Asset management
  const createAsset = async (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Asset> => {
    try {
      let createdAsset: Asset;
      
      if (useSupabase) {
        createdAsset = await assetService.create(asset);
      } else {
        createdAsset = assetStorage.create(asset);
      }
      
      setAssets(prev => [...prev, createdAsset]);
      await refreshData();
      return createdAsset;
    } catch (error) {
      console.error('Error creating asset:', error);
      throw error;
    }
  };
  
  const updateAsset = async (id: string, asset: Partial<Asset>): Promise<Asset> => {
    try {
      let updatedAsset: Asset;
      
      if (useSupabase) {
        updatedAsset = await assetService.update(id, asset);
      } else {
        updatedAsset = assetStorage.update(id, asset);
      }
      
      setAssets(prev => prev.map(a => a.id === id ? updatedAsset : a));
      return updatedAsset;
    } catch (error) {
      console.error('Error updating asset:', error);
      throw error;
    }
  };
  
  const deleteAsset = async (id: string): Promise<boolean> => {
    try {
      let success: boolean;
      
      if (useSupabase) {
        success = await assetService.delete(id);
      } else {
        success = assetStorage.delete(id);
      }
      
      if (success) {
        setAssets(prev => prev.filter(a => a.id !== id));
        await refreshData();
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  };
  
  // Vulnerability management
  const createVulnerability = async (vuln: Omit<VulnClass, 'id' | 'createdAt'>): Promise<VulnClass> => {
    try {
      let createdVuln: VulnClass;
      
      if (useSupabase) {
        createdVuln = await vulnerabilityService.create(vuln);
      } else {
        createdVuln = vulnerabilityStorage.create(vuln);
      }
      
      setVulnerabilities(prev => [...prev, createdVuln]);
      await refreshData();
      return createdVuln;
    } catch (error) {
      console.error('Error creating vulnerability:', error);
      throw error;
    }
  };
  
  const updateVulnerability = async (id: string, vuln: Partial<VulnClass>): Promise<VulnClass> => {
    try {
      let updatedVuln: VulnClass;
      
      if (useSupabase) {
        updatedVuln = await vulnerabilityService.update(id, vuln);
      } else {
        updatedVuln = vulnerabilityStorage.update(id, vuln);
      }
      
      setVulnerabilities(prev => prev.map(v => v.id === id ? updatedVuln : v));
      return updatedVuln;
    } catch (error) {
      console.error('Error updating vulnerability:', error);
      throw error;
    }
  };
  
  const deleteVulnerability = async (id: string): Promise<boolean> => {
    try {
      let success: boolean;
      
      if (useSupabase) {
        success = await vulnerabilityService.delete(id);
      } else {
        success = vulnerabilityStorage.delete(id);
      }
      
      if (success) {
        setVulnerabilities(prev => prev.filter(v => v.id !== id));
        await refreshData();
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting vulnerability:', error);
      throw error;
    }
  };
  
  // Methodology management
  const createMethodology = async (method: Omit<Methodology, 'id' | 'createdAt'>): Promise<Methodology> => {
    try {
      let createdMethod: Methodology;
      
      if (useSupabase) {
        createdMethod = await methodologyService.create(method);
      } else {
        createdMethod = methodologyStorage.create(method);
      }
      
      setMethodologies(prev => [...prev, createdMethod]);
      await refreshData();
      return createdMethod;
    } catch (error) {
      console.error('Error creating methodology:', error);
      throw error;
    }
  };
  
  const updateMethodology = async (id: string, method: Partial<Methodology>): Promise<Methodology> => {
    try {
      let updatedMethod: Methodology;
      
      if (useSupabase) {
        updatedMethod = await methodologyService.update(id, method);
      } else {
        updatedMethod = methodologyStorage.update(id, method);
      }
      
      setMethodologies(prev => prev.map(m => m.id === id ? updatedMethod : m));
      return updatedMethod;
    } catch (error) {
      console.error('Error updating methodology:', error);
      throw error;
    }
  };
  
  const deleteMethodology = async (id: string): Promise<boolean> => {
    try {
      let success: boolean;
      
      if (useSupabase) {
        success = await methodologyService.delete(id);
      } else {
        success = methodologyStorage.delete(id);
      }
      
      if (success) {
        setMethodologies(prev => prev.filter(m => m.id !== id));
        await refreshData();
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting methodology:', error);
      throw error;
    }
  };
  
  // Playbook management
  const createPlaybook = async (playbook: Omit<Playbook, 'id' | 'createdAt'>): Promise<Playbook> => {
    try {
      let createdPlaybook: Playbook;
      
      if (useSupabase) {
        createdPlaybook = await playbookService.create(playbook);
      } else {
        createdPlaybook = playbookStorage.create(playbook);
      }
      
      setPlaybooks(prev => [...prev, createdPlaybook]);
      await refreshData();
      return createdPlaybook;
    } catch (error) {
      console.error('Error creating playbook:', error);
      throw error;
    }
  };
  
  const updatePlaybook = async (id: string, playbook: Partial<Playbook>): Promise<Playbook> => {
    try {
      let updatedPlaybook: Playbook;
      
      if (useSupabase) {
        updatedPlaybook = await playbookService.update(id, playbook);
      } else {
        updatedPlaybook = playbookStorage.update(id, playbook);
      }
      
      setPlaybooks(prev => prev.map(p => p.id === id ? updatedPlaybook : p));
      return updatedPlaybook;
    } catch (error) {
      console.error('Error updating playbook:', error);
      throw error;
    }
  };
  
  const deletePlaybook = async (id: string): Promise<boolean> => {
    try {
      let success: boolean;
      
      if (useSupabase) {
        success = await playbookService.delete(id);
      } else {
        success = playbookStorage.delete(id);
      }
      
      if (success) {
        setPlaybooks(prev => prev.filter(p => p.id !== id));
        await refreshData();
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting playbook:', error);
      throw error;
    }
  };
  
  // Context provider value
  const contextValue: AppContextData = {
    currentUser,
    isAuthenticated,
    isLoading,
    useSupabase,
    login,
    logout,
    register,
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    programs,
    createProgram,
    updateProgram,
    deleteProgram,
    assets,
    createAsset,
    updateAsset,
    deleteAsset,
    vulnerabilities,
    createVulnerability,
    updateVulnerability,
    deleteVulnerability,
    methodologies,
    createMethodology,
    updateMethodology,
    deleteMethodology,
    playbooks,
    createPlaybook,
    updatePlaybook,
    deletePlaybook,
    dashboardStats,
    recentActivity,
    refreshData
  };
  
  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};