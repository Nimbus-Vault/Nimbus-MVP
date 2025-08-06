import { v4 as uuidv4 } from 'uuid';
import {
  User,
  UserRole,
  Role,
  Workspace,
  Program,
  Asset,
  VulnClass,
  Methodology,
  MethodologyCategory,
  Playbook,
  ProgramStatus,
  AssetType,
  VulnSeverity
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

// User Storage
export const userStorage = {
  getAll(): User[] {
    return getFromStorage<User>('nimbusVaultUsers');
  },

  getCurrentUser(): User | null {
    try {
      const user = localStorage.getItem('nimbusVaultCurrentUser');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error retrieving current user:', error);
      return null;
    }
  },

  signIn(email: string, password: string): User {
    const users = this.getAll();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    localStorage.setItem('nimbusVaultCurrentUser', JSON.stringify(user));
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  },

  signOut(): void {
    localStorage.removeItem('nimbusVaultCurrentUser');
  },

  register(email: string, password: string, fullName?: string): User {
    const users = this.getAll();
    
    if (users.some(u => u.email === email)) {
      throw new Error('User with this email already exists');
    }
    
    const newUser: User = {
      id: uuidv4(),
      email,
      password,
      fullName: fullName || '',
      createdAt: new Date().toISOString(),
      active: true
    };
    
    users.push(newUser);
    saveToStorage('nimbusVaultUsers', users);
    
    localStorage.setItem('nimbusVaultCurrentUser', JSON.stringify(newUser));
    
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  },

  create(email: string, password: string, fullName?: string): User {
    return this.register(email, password, fullName);
  },
  
  update(id: string, userData: Partial<User>): User {
    const users = this.getAll();
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
      throw new Error('User not found');
    }
    
    const updatedUser = { ...users[index], ...userData };
    users[index] = updatedUser;
    saveToStorage('nimbusVaultUsers', users);
    
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === id) {
      localStorage.setItem('nimbusVaultCurrentUser', JSON.stringify(updatedUser));
    }
    
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  },
  
  delete(id: string): boolean {
    const users = this.getAll();
    const filteredUsers = users.filter(u => u.id !== id);
    
    if (filteredUsers.length === users.length) {
      throw new Error('User not found');
    }
    
    saveToStorage('nimbusVaultUsers', filteredUsers);
    
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === id) {
      localStorage.removeItem('nimbusVaultCurrentUser');
    }
    
    return true;
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