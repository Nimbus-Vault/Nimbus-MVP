import { v4 as uuidv4 } from 'uuid';
import {
  VulnClass,
  VulnSeverity,
  Methodology,
  MethodologyCategory,
  Playbook
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

// Vulnerability Storage
export const vulnerabilityStorage = {
  getAll(): VulnClass[] {
    return getFromStorage<VulnClass>('nimbusVaultVulnerabilities');
  },
  
  getById(id: string): VulnClass | null {
    const vulnerabilities = this.getAll();
    return vulnerabilities.find(v => v.id === id) || null;
  },
  
  getByWorkspaceId(workspaceId: string): VulnClass[] {
    const vulnerabilities = this.getAll();
    return vulnerabilities.filter(v => v.workspaceId === workspaceId);
  },
  
  create(vulnerability: Omit<VulnClass, 'id' | 'createdAt'>): VulnClass {
    const vulnerabilities = this.getAll();
    const now = new Date().toISOString();
    
    const newVulnerability: VulnClass = {
      id: uuidv4(),
      createdAt: now,
      severity: vulnerability.severity || VulnSeverity.Medium,
      ...vulnerability
    };
    
    vulnerabilities.push(newVulnerability);
    saveToStorage('nimbusVaultVulnerabilities', vulnerabilities);
    
    return newVulnerability;
  },
  
  update(id: string, vulnerabilityData: Partial<VulnClass>): VulnClass {
    const vulnerabilities = this.getAll();
    const index = vulnerabilities.findIndex(v => v.id === id);
    
    if (index === -1) {
      throw new Error('Vulnerability not found');
    }
    
    const updatedVulnerability = { 
      ...vulnerabilities[index], 
      ...vulnerabilityData
    };
    
    vulnerabilities[index] = updatedVulnerability;
    saveToStorage('nimbusVaultVulnerabilities', vulnerabilities);
    
    return updatedVulnerability;
  },
  
  delete(id: string): boolean {
    const vulnerabilities = this.getAll();
    const filteredVulnerabilities = vulnerabilities.filter(v => v.id !== id);
    
    if (filteredVulnerabilities.length === vulnerabilities.length) {
      throw new Error('Vulnerability not found');
    }
    
    saveToStorage('nimbusVaultVulnerabilities', filteredVulnerabilities);
    
    return true;
  }
};

// Methodology Storage
export const methodologyStorage = {
  getAll(): Methodology[] {
    return getFromStorage<Methodology>('nimbusVaultMethodologies');
  },
  
  getById(id: string): Methodology | null {
    const methodologies = this.getAll();
    return methodologies.find(m => m.id === id) || null;
  },
  
  getByWorkspaceId(workspaceId: string): Methodology[] {
    const methodologies = this.getAll();
    return methodologies.filter(m => m.workspaceId === workspaceId);
  },
  
  getByVulnClassId(vulnClassId: string): Methodology[] {
    const methodologies = this.getAll();
    return methodologies.filter(m => m.vulnClassId === vulnClassId);
  },
  
  create(methodology: Omit<Methodology, 'id' | 'createdAt'>): Methodology {
    const methodologies = this.getAll();
    const now = new Date().toISOString();
    
    const newMethodology: Methodology = {
      id: uuidv4(),
      createdAt: now,
      ...methodology
    };
    
    methodologies.push(newMethodology);
    saveToStorage('nimbusVaultMethodologies', methodologies);
    
    return newMethodology;
  },
  
  update(id: string, methodologyData: Partial<Methodology>): Methodology {
    const methodologies = this.getAll();
    const index = methodologies.findIndex(m => m.id === id);
    
    if (index === -1) {
      throw new Error('Methodology not found');
    }
    
    const updatedMethodology = { 
      ...methodologies[index], 
      ...methodologyData
    };
    
    methodologies[index] = updatedMethodology;
    saveToStorage('nimbusVaultMethodologies', methodologies);
    
    return updatedMethodology;
  },
  
  delete(id: string): boolean {
    const methodologies = this.getAll();
    const filteredMethodologies = methodologies.filter(m => m.id !== id);
    
    if (filteredMethodologies.length === methodologies.length) {
      throw new Error('Methodology not found');
    }
    
    // Delete related playbooks
    const playbooks = playbookStorage.getAll();
    const filteredPlaybooks = playbooks.filter(p => p.methodologyId !== id);
    saveToStorage('nimbusVaultPlaybooks', filteredPlaybooks);
    
    saveToStorage('nimbusVaultMethodologies', filteredMethodologies);
    
    return true;
  }
};

// Methodology Category Storage
export const methodologyCategoryStorage = {
  getAll(): MethodologyCategory[] {
    return getFromStorage<MethodologyCategory>('nimbusVaultMethodologyCategories');
  },
  
  getById(id: string): MethodologyCategory | null {
    const categories = this.getAll();
    return categories.find(c => c.id === id) || null;
  },
  
  getByWorkspaceId(workspaceId: string): MethodologyCategory[] {
    const categories = this.getAll();
    return categories.filter(c => c.workspaceId === workspaceId);
  },
  
  create(category: Omit<MethodologyCategory, 'id'>): MethodologyCategory {
    const categories = this.getAll();
    
    const newCategory: MethodologyCategory = {
      id: uuidv4(),
      ...category
    };
    
    categories.push(newCategory);
    saveToStorage('nimbusVaultMethodologyCategories', categories);
    
    return newCategory;
  },
  
  update(id: string, categoryData: Partial<MethodologyCategory>): MethodologyCategory {
    const categories = this.getAll();
    const index = categories.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new Error('Methodology category not found');
    }
    
    const updatedCategory = { 
      ...categories[index], 
      ...categoryData
    };
    
    categories[index] = updatedCategory;
    saveToStorage('nimbusVaultMethodologyCategories', categories);
    
    return updatedCategory;
  },
  
  delete(id: string): boolean {
    const categories = this.getAll();
    const filteredCategories = categories.filter(c => c.id !== id);
    
    if (filteredCategories.length === categories.length) {
      throw new Error('Methodology category not found');
    }
    
    // Update methodologies that use this category
    const methodologies = methodologyStorage.getAll();
    const updatedMethodologies = methodologies.map(m => {
      if (m.categoryId === id) {
        return { ...m, categoryId: null };
      }
      return m;
    });
    saveToStorage('nimbusVaultMethodologies', updatedMethodologies);
    
    saveToStorage('nimbusVaultMethodologyCategories', filteredCategories);
    
    return true;
  }
};

// Playbook Storage
export const playbookStorage = {
  getAll(): Playbook[] {
    return getFromStorage<Playbook>('nimbusVaultPlaybooks');
  },
  
  getById(id: string): Playbook | null {
    const playbooks = this.getAll();
    return playbooks.find(p => p.id === id) || null;
  },
  
  getByWorkspaceId(workspaceId: string): Playbook[] {
    const playbooks = this.getAll();
    return playbooks.filter(p => p.workspaceId === workspaceId);
  },
  
  getByMethodologyId(methodologyId: string): Playbook[] {
    const playbooks = this.getAll();
    return playbooks.filter(p => p.methodologyId === methodologyId);
  },
  
  create(playbook: Omit<Playbook, 'id' | 'createdAt'>): Playbook {
    const playbooks = this.getAll();
    const now = new Date().toISOString();
    
    const newPlaybook: Playbook = {
      id: uuidv4(),
      createdAt: now,
      ...playbook
    };
    
    playbooks.push(newPlaybook);
    saveToStorage('nimbusVaultPlaybooks', playbooks);
    
    return newPlaybook;
  },
  
  update(id: string, playbookData: Partial<Playbook>): Playbook {
    const playbooks = this.getAll();
    const index = playbooks.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Playbook not found');
    }
    
    const updatedPlaybook = { 
      ...playbooks[index], 
      ...playbookData
    };
    
    playbooks[index] = updatedPlaybook;
    saveToStorage('nimbusVaultPlaybooks', playbooks);
    
    return updatedPlaybook;
  },
  
  delete(id: string): boolean {
    const playbooks = this.getAll();
    const filteredPlaybooks = playbooks.filter(p => p.id !== id);
    
    if (filteredPlaybooks.length === playbooks.length) {
      throw new Error('Playbook not found');
    }
    
    saveToStorage('nimbusVaultPlaybooks', filteredPlaybooks);
    
    return true;
  }
};