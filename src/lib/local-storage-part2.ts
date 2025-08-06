import { v4 as uuidv4 } from 'uuid';
import {
  Role,
  UserRole,
  Workspace,
  Program,
  Asset,
  ProgramStatus,
  AssetType
} from '@/types';

// Helper functions
const getFromStorage = <T>(key: string): T[] => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error(`Error retrieving from localStorage: ${key}`, error);
    return [];
  }
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage: ${key}`, error);
  }
};

// Role Storage
export const roleStorage = {
  getAll(): Role[] {
    return getFromStorage<Role>('nimbusVaultRoles');
  },
  
  getById(id: string): Role | null {
    const roles = this.getAll();
    return roles.find(r => r.id === id) || null;
  },
  
  create(role: Omit<Role, 'id'>): Role {
    const roles = this.getAll();
    
    const newRole: Role = {
      id: uuidv4(),
      ...role
    };
    
    roles.push(newRole);
    saveToStorage('nimbusVaultRoles', roles);
    
    return newRole;
  },
  
  update(id: string, roleData: Partial<Role>): Role {
    const roles = this.getAll();
    const index = roles.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('Role not found');
    }
    
    const updatedRole = { ...roles[index], ...roleData };
    roles[index] = updatedRole;
    saveToStorage('nimbusVaultRoles', roles);
    
    return updatedRole;
  },
  
  delete(id: string): boolean {
    const roles = this.getAll();
    const filteredRoles = roles.filter(r => r.id !== id);
    
    if (filteredRoles.length === roles.length) {
      throw new Error('Role not found');
    }
    
    saveToStorage('nimbusVaultRoles', filteredRoles);
    
    return true;
  }
};

// User Role Storage
export const userRoleStorage = {
  getAll(): UserRole[] {
    return getFromStorage<UserRole>('nimbusVaultUserRoles');
  },
  
  getUserRoles(userId: string): UserRole[] {
    const userRoles = this.getAll();
    return userRoles.filter(ur => ur.userId === userId);
  },
  
  getWorkspaceUsers(workspaceId: string): UserRole[] {
    const userRoles = this.getAll();
    return userRoles.filter(ur => ur.workspaceId === workspaceId);
  },
  
  create(userRole: Omit<UserRole, 'id'>): UserRole {
    const userRoles = this.getAll();
    
    const newUserRole: UserRole = {
      id: uuidv4(),
      ...userRole
    };
    
    userRoles.push(newUserRole);
    saveToStorage('nimbusVaultUserRoles', userRoles);
    
    return newUserRole;
  },
  
  update(id: string, userRoleData: Partial<UserRole>): UserRole {
    const userRoles = this.getAll();
    const index = userRoles.findIndex(ur => ur.id === id);
    
    if (index === -1) {
      throw new Error('User role not found');
    }
    
    const updatedUserRole = { ...userRoles[index], ...userRoleData };
    userRoles[index] = updatedUserRole;
    saveToStorage('nimbusVaultUserRoles', userRoles);
    
    return updatedUserRole;
  },
  
  delete(id: string): boolean {
    const userRoles = this.getAll();
    const filteredUserRoles = userRoles.filter(ur => ur.id !== id);
    
    if (filteredUserRoles.length === userRoles.length) {
      throw new Error('User role not found');
    }
    
    saveToStorage('nimbusVaultUserRoles', filteredUserRoles);
    
    return true;
  }
};

// Workspace Storage
export const workspaceStorage = {
  getAll(): Workspace[] {
    return getFromStorage<Workspace>('nimbusVaultWorkspaces');
  },
  
  getById(id: string): Workspace | null {
    const workspaces = this.getAll();
    return workspaces.find(w => w.id === id) || null;
  },
  
  getUserWorkspaces(userId: string): Workspace[] {
    const workspaces = this.getAll();
    const userRoles = userRoleStorage.getUserRoles(userId);
    const workspaceIds = userRoles.map(ur => ur.workspaceId);
    
    return workspaces.filter(w => workspaceIds.includes(w.id));
  },
  
  create(workspace: Omit<Workspace, 'id' | 'createdAt'>): Workspace {
    const workspaces = this.getAll();
    
    const newWorkspace: Workspace = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...workspace
    };
    
    workspaces.push(newWorkspace);
    saveToStorage('nimbusVaultWorkspaces', workspaces);
    
    userRoleStorage.create({
      userId: workspace.ownerId,
      workspaceId: newWorkspace.id,
      roleId: 'owner',
      active: true
    });
    
    return newWorkspace;
  },
  
  update(id: string, workspaceData: Partial<Workspace>): Workspace {
    const workspaces = this.getAll();
    const index = workspaces.findIndex(w => w.id === id);
    
    if (index === -1) {
      throw new Error('Workspace not found');
    }
    
    const updatedWorkspace = { ...workspaces[index], ...workspaceData };
    workspaces[index] = updatedWorkspace;
    saveToStorage('nimbusVaultWorkspaces', workspaces);
    
    return updatedWorkspace;
  },
  
  delete(id: string): boolean {
    const workspaces = this.getAll();
    const filteredWorkspaces = workspaces.filter(w => w.id !== id);
    
    if (filteredWorkspaces.length === workspaces.length) {
      throw new Error('Workspace not found');
    }
    
    // Delete related data
    const userRoles = userRoleStorage.getAll();
    const filteredUserRoles = userRoles.filter(ur => ur.workspaceId !== id);
    saveToStorage('nimbusVaultUserRoles', filteredUserRoles);
    
    const programs = programStorage.getAll();
    const filteredPrograms = programs.filter(p => p.workspaceId !== id);
    saveToStorage('nimbusVaultPrograms', filteredPrograms);
    
    const assets = assetStorage.getAll();
    const filteredAssets = assets.filter(a => a.workspaceId !== id);
    saveToStorage('nimbusVaultAssets', filteredAssets);
    
    saveToStorage('nimbusVaultWorkspaces', filteredWorkspaces);
    
    return true;
  }
};

// Program Storage
export const programStorage = {
  getAll(): Program[] {
    return getFromStorage<Program>('nimbusVaultPrograms');
  },
  
  getById(id: string): Program | null {
    const programs = this.getAll();
    return programs.find(p => p.id === id) || null;
  },
  
  getByWorkspaceId(workspaceId: string): Program[] {
    const programs = this.getAll();
    return programs.filter(p => p.workspaceId === workspaceId);
  },
  
  create(program: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>): Program {
    const programs = this.getAll();
    const now = new Date().toISOString();
    
    const newProgram: Program = {
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      status: program.status || ProgramStatus.Active,
      ...program
    };
    
    programs.push(newProgram);
    saveToStorage('nimbusVaultPrograms', programs);
    
    return newProgram;
  },
  
  update(id: string, programData: Partial<Program>): Program {
    const programs = this.getAll();
    const index = programs.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Program not found');
    }
    
    const updatedProgram = { 
      ...programs[index], 
      ...programData, 
      updatedAt: new Date().toISOString() 
    };
    
    programs[index] = updatedProgram;
    saveToStorage('nimbusVaultPrograms', programs);
    
    return updatedProgram;
  },
  
  delete(id: string): boolean {
    const programs = this.getAll();
    const filteredPrograms = programs.filter(p => p.id !== id);
    
    if (filteredPrograms.length === programs.length) {
      throw new Error('Program not found');
    }
    
    const assets = assetStorage.getAll();
    const filteredAssets = assets.filter(a => a.programId !== id);
    saveToStorage('nimbusVaultAssets', filteredAssets);
    
    saveToStorage('nimbusVaultPrograms', filteredPrograms);
    
    return true;
  }
};

// Asset Storage
export const assetStorage = {
  getAll(): Asset[] {
    return getFromStorage<Asset>('nimbusVaultAssets');
  },
  
  getById(id: string): Asset | null {
    const assets = this.getAll();
    return assets.find(a => a.id === id) || null;
  },
  
  getByWorkspaceId(workspaceId: string): Asset[] {
    const assets = this.getAll();
    return assets.filter(a => a.workspaceId === workspaceId);
  },
  
  getByProgramId(programId: string): Asset[] {
    const assets = this.getAll();
    return assets.filter(a => a.programId === programId);
  },
  
  create(asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Asset {
    const assets = this.getAll();
    const now = new Date().toISOString();
    
    const newAsset: Asset = {
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      type: asset.type || AssetType.WebApplication,
      ...asset
    };
    
    assets.push(newAsset);
    saveToStorage('nimbusVaultAssets', assets);
    
    return newAsset;
  },
  
  update(id: string, assetData: Partial<Asset>): Asset {
    const assets = this.getAll();
    const index = assets.findIndex(a => a.id === id);
    
    if (index === -1) {
      throw new Error('Asset not found');
    }
    
    const updatedAsset = { 
      ...assets[index], 
      ...assetData, 
      updatedAt: new Date().toISOString() 
    };
    
    assets[index] = updatedAsset;
    saveToStorage('nimbusVaultAssets', assets);
    
    return updatedAsset;
  },
  
  delete(id: string): boolean {
    const assets = this.getAll();
    const filteredAssets = assets.filter(a => a.id !== id);
    
    if (filteredAssets.length === assets.length) {
      throw new Error('Asset not found');
    }
    
    saveToStorage('nimbusVaultAssets', filteredAssets);
    
    return true;
  }
};