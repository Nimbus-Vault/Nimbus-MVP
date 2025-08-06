import { 
  TechnologyTemplate, 
  FunctionalityTemplate, 
  BehaviorTemplate,
  AssetTechnology,
  AssetFunctionality,
  AssetBehavior,
  FunctionalityBehavior,
  TechnologyBehavior
} from '@/types';

// Local storage keys for templates
const STORAGE_KEYS = {
  TECHNOLOGY_TEMPLATES: 'nimbus_technology_templates',
  FUNCTIONALITY_TEMPLATES: 'nimbus_functionality_templates',
  BEHAVIOR_TEMPLATES: 'nimbus_behavior_templates',
  ASSET_TECHNOLOGIES: 'nimbus_asset_technologies',
  ASSET_FUNCTIONALITIES: 'nimbus_asset_functionalities',
  ASSET_BEHAVIORS: 'nimbus_asset_behaviors',
  FUNCTIONALITY_BEHAVIORS: 'nimbus_functionality_behaviors',
  TECHNOLOGY_BEHAVIORS: 'nimbus_technology_behaviors',
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

// Technology Templates
export const getTechnologyTemplates = (): TechnologyTemplate[] => {
  return getFromStorage(STORAGE_KEYS.TECHNOLOGY_TEMPLATES, []);
};

export const addTechnologyTemplate = (template: Omit<TechnologyTemplate, 'id' | 'createdAt' | 'modifiedAt'>): TechnologyTemplate => {
  const templates = getTechnologyTemplates();
  const newTemplate: TechnologyTemplate = {
    ...template,
    id: generateId(),
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString()
  };
  templates.push(newTemplate);
  saveToStorage(STORAGE_KEYS.TECHNOLOGY_TEMPLATES, templates);
  return newTemplate;
};

export const updateTechnologyTemplate = (id: string, updates: Partial<TechnologyTemplate>): TechnologyTemplate | null => {
  const templates = getTechnologyTemplates();
  const index = templates.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  templates[index] = { 
    ...templates[index], 
    ...updates, 
    modifiedAt: new Date().toISOString() 
  };
  saveToStorage(STORAGE_KEYS.TECHNOLOGY_TEMPLATES, templates);
  return templates[index];
};

export const deleteTechnologyTemplate = (id: string): boolean => {
  const templates = getTechnologyTemplates();
  const filtered = templates.filter(t => t.id !== id);
  if (filtered.length === templates.length) return false;
  
  saveToStorage(STORAGE_KEYS.TECHNOLOGY_TEMPLATES, filtered);
  return true;
};

// Functionality Templates
export const getFunctionalityTemplates = (): FunctionalityTemplate[] => {
  return getFromStorage(STORAGE_KEYS.FUNCTIONALITY_TEMPLATES, []);
};

export const addFunctionalityTemplate = (template: Omit<FunctionalityTemplate, 'id' | 'createdAt' | 'modifiedAt'>): FunctionalityTemplate => {
  const templates = getFunctionalityTemplates();
  const newTemplate: FunctionalityTemplate = {
    ...template,
    id: generateId(),
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString()
  };
  templates.push(newTemplate);
  saveToStorage(STORAGE_KEYS.FUNCTIONALITY_TEMPLATES, templates);
  return newTemplate;
};

export const updateFunctionalityTemplate = (id: string, updates: Partial<FunctionalityTemplate>): FunctionalityTemplate | null => {
  const templates = getFunctionalityTemplates();
  const index = templates.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  templates[index] = { 
    ...templates[index], 
    ...updates, 
    modifiedAt: new Date().toISOString() 
  };
  saveToStorage(STORAGE_KEYS.FUNCTIONALITY_TEMPLATES, templates);
  return templates[index];
};

export const deleteFunctionalityTemplate = (id: string): boolean => {
  const templates = getFunctionalityTemplates();
  const filtered = templates.filter(t => t.id !== id);
  if (filtered.length === templates.length) return false;
  
  saveToStorage(STORAGE_KEYS.FUNCTIONALITY_TEMPLATES, filtered);
  return true;
};

// Behavior Templates
export const getBehaviorTemplates = (): BehaviorTemplate[] => {
  return getFromStorage(STORAGE_KEYS.BEHAVIOR_TEMPLATES, []);
};

export const addBehaviorTemplate = (template: Omit<BehaviorTemplate, 'id' | 'createdAt' | 'modifiedAt'>): BehaviorTemplate => {
  const templates = getBehaviorTemplates();
  const newTemplate: BehaviorTemplate = {
    ...template,
    id: generateId(),
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString()
  };
  templates.push(newTemplate);
  saveToStorage(STORAGE_KEYS.BEHAVIOR_TEMPLATES, templates);
  return newTemplate;
};

export const updateBehaviorTemplate = (id: string, updates: Partial<BehaviorTemplate>): BehaviorTemplate | null => {
  const templates = getBehaviorTemplates();
  const index = templates.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  templates[index] = { 
    ...templates[index], 
    ...updates, 
    modifiedAt: new Date().toISOString() 
  };
  saveToStorage(STORAGE_KEYS.BEHAVIOR_TEMPLATES, templates);
  return templates[index];
};

export const deleteBehaviorTemplate = (id: string): boolean => {
  const templates = getBehaviorTemplates();
  const filtered = templates.filter(t => t.id !== id);
  if (filtered.length === templates.length) return false;
  
  saveToStorage(STORAGE_KEYS.BEHAVIOR_TEMPLATES, filtered);
  return true;
};

// Asset Technology Assignments
export const getAssetTechnologies = (assetId?: string): AssetTechnology[] => {
  const assignments = getFromStorage(STORAGE_KEYS.ASSET_TECHNOLOGIES, []);
  return assetId ? assignments.filter(a => a.assetId === assetId) : assignments;
};

export const assignTechnologyToAsset = (assignment: Omit<AssetTechnology, 'id' | 'assignedAt'>): AssetTechnology => {
  const assignments = getAssetTechnologies();
  const newAssignment: AssetTechnology = {
    ...assignment,
    id: generateId(),
    assignedAt: new Date().toISOString()
  };
  assignments.push(newAssignment);
  saveToStorage(STORAGE_KEYS.ASSET_TECHNOLOGIES, assignments);
  return newAssignment;
};

export const unassignTechnologyFromAsset = (assetId: string, technologyId: string): boolean => {
  const assignments = getAssetTechnologies();
  const filtered = assignments.filter(a => !(a.assetId === assetId && a.id === technologyId));
  if (filtered.length === assignments.length) return false;
  
  saveToStorage(STORAGE_KEYS.ASSET_TECHNOLOGIES, filtered);
  return true;
};

// Asset Functionality Assignments
export const getAssetFunctionalities = (assetId?: string): AssetFunctionality[] => {
  const assignments = getFromStorage(STORAGE_KEYS.ASSET_FUNCTIONALITIES, []);
  return assetId ? assignments.filter(a => a.assetId === assetId) : assignments;
};

export const assignFunctionalityToAsset = (assignment: Omit<AssetFunctionality, 'id' | 'assignedAt'>): AssetFunctionality => {
  const assignments = getAssetFunctionalities();
  const newAssignment: AssetFunctionality = {
    ...assignment,
    id: generateId(),
    assignedAt: new Date().toISOString()
  };
  assignments.push(newAssignment);
  saveToStorage(STORAGE_KEYS.ASSET_FUNCTIONALITIES, assignments);
  return newAssignment;
};

export const unassignFunctionalityFromAsset = (assetId: string, functionalityId: string): boolean => {
  const assignments = getAssetFunctionalities();
  const filtered = assignments.filter(a => !(a.assetId === assetId && a.id === functionalityId));
  if (filtered.length === assignments.length) return false;
  
  saveToStorage(STORAGE_KEYS.ASSET_FUNCTIONALITIES, filtered);
  return true;
};

// Asset Behavior Assignments
export const getAssetBehaviors = (assetId?: string): AssetBehavior[] => {
  const assignments = getFromStorage(STORAGE_KEYS.ASSET_BEHAVIORS, []);
  return assetId ? assignments.filter(a => a.assetId === assetId) : assignments;
};

export const assignBehaviorToAsset = (assignment: Omit<AssetBehavior, 'id' | 'assignedAt'>): AssetBehavior => {
  const assignments = getAssetBehaviors();
  const newAssignment: AssetBehavior = {
    ...assignment,
    id: generateId(),
    assignedAt: new Date().toISOString()
  };
  assignments.push(newAssignment);
  saveToStorage(STORAGE_KEYS.ASSET_BEHAVIORS, assignments);
  return newAssignment;
};

export const unassignBehaviorFromAsset = (assetId: string, behaviorId: string): boolean => {
  const assignments = getAssetBehaviors();
  const filtered = assignments.filter(a => !(a.assetId === assetId && a.id === behaviorId));
  if (filtered.length === assignments.length) return false;
  
  saveToStorage(STORAGE_KEYS.ASSET_BEHAVIORS, filtered);
  return true;
};

// Functionality Behavior Assignments
export const getFunctionalityBehaviors = (functionalityId?: string): FunctionalityBehavior[] => {
  const assignments = getFromStorage(STORAGE_KEYS.FUNCTIONALITY_BEHAVIORS, []);
  return functionalityId ? assignments.filter(a => a.functionalityId === functionalityId) : assignments;
};

export const assignBehaviorToFunctionality = (assignment: Omit<FunctionalityBehavior, 'id' | 'assignedAt'>): FunctionalityBehavior => {
  const assignments = getFunctionalityBehaviors();
  const newAssignment: FunctionalityBehavior = {
    ...assignment,
    id: generateId(),
    assignedAt: new Date().toISOString()
  };
  assignments.push(newAssignment);
  saveToStorage(STORAGE_KEYS.FUNCTIONALITY_BEHAVIORS, assignments);
  return newAssignment;
};

// Technology Behavior Assignments
export const getTechnologyBehaviors = (technologyId?: string): TechnologyBehavior[] => {
  const assignments = getFromStorage(STORAGE_KEYS.TECHNOLOGY_BEHAVIORS, []);
  return technologyId ? assignments.filter(a => a.technologyId === technologyId) : assignments;
};

export const assignBehaviorToTechnology = (assignment: Omit<TechnologyBehavior, 'id' | 'assignedAt'>): TechnologyBehavior => {
  const assignments = getTechnologyBehaviors();
  const newAssignment: TechnologyBehavior = {
    ...assignment,
    id: generateId(),
    assignedAt: new Date().toISOString()
  };
  assignments.push(newAssignment);
  saveToStorage(STORAGE_KEYS.TECHNOLOGY_BEHAVIORS, assignments);
  return newAssignment;
};

// Initialize sample data for templates
export const initializeSampleTemplateData = (): void => {
  // Technology Templates
  if (getTechnologyTemplates().length === 0) {
    const sampleTechTemplates = [
      {
        workspaceId: 'default-workspace',
        version: '1.0.0',
        name: 'React',
        vendor: 'Meta',
        category: 'JavaScript Framework',
        docUrl: 'https://reactjs.org/docs/',
        description: 'A JavaScript library for building user interfaces',
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        workspaceId: 'default-workspace',
        version: '1.0.0',
        name: 'Apache Struts',
        vendor: 'Apache Software Foundation',
        category: 'Java Framework',
        docUrl: 'https://struts.apache.org/getting-started/',
        description: 'Apache Struts is a free, open-source, MVC framework for creating elegant, modern Java web applications',
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        workspaceId: 'default-workspace',
        version: '1.0.0',
        name: 'Spring Boot',
        vendor: 'VMware',
        category: 'Java Framework',
        docUrl: 'https://spring.io/projects/spring-boot',
        description: 'Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications',
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        workspaceId: 'default-workspace',
        version: '1.0.0',
        name: 'WordPress',
        vendor: 'WordPress Foundation',
        category: 'CMS',
        docUrl: 'https://wordpress.org/support/',
        description: 'WordPress is open source software you can use to create a beautiful website, blog, or app',
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        workspaceId: 'default-workspace',
        version: '1.0.0',
        name: 'PHP',
        vendor: 'The PHP Group',
        category: 'Programming Language',
        docUrl: 'https://www.php.net/docs.php',
        description: 'PHP is a popular general-purpose scripting language that is especially suited to web development',
        createdBy: 'system',
        modifiedBy: 'system'
      }
    ];

    sampleTechTemplates.forEach(template => addTechnologyTemplate(template));
  }

  // Functionality Templates
  if (getFunctionalityTemplates().length === 0) {
    const sampleFuncTemplates = [
      {
        workspaceId: 'default-workspace',
        version: '1.0.0',
        name: 'File Upload',
        category: 'Data Management',
        description: 'Functionality for uploading files to the server',
        commonEndpoints: '/upload, /file-upload, /media/upload',
        notes: 'Test for file type restrictions, size limits, and path traversal',
        diagramMd: null,
        commonVectors: 'RCE via file upload, Path traversal, XSS via file content',
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        workspaceId: 'default-workspace',
        version: '1.0.0',
        name: 'User Authentication',
        category: 'Authentication',
        description: 'User login and authentication functionality',
        commonEndpoints: '/login, /auth, /signin, /authenticate',
        notes: 'Test for credential stuffing, brute force, session management',
        diagramMd: null,
        commonVectors: 'SQL injection, Authentication bypass, Session hijacking',
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        workspaceId: 'default-workspace',
        version: '1.0.0',
        name: 'Password Reset',
        category: 'Authentication',
        description: 'Password reset and recovery functionality',
        commonEndpoints: '/reset-password, /forgot-password, /recover',
        notes: 'Test for token prediction, user enumeration, race conditions',
        diagramMd: null,
        commonVectors: 'Account takeover, User enumeration, Token manipulation',
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        workspaceId: 'default-workspace',
        version: '1.0.0',
        name: 'User Registration',
        category: 'Authentication',
        description: 'New user account creation functionality',
        commonEndpoints: '/register, /signup, /create-account',
        notes: 'Test for duplicate accounts, input validation, email verification bypass',
        diagramMd: null,
        commonVectors: 'Account takeover, XSS, SQL injection',
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        workspaceId: 'default-workspace',
        version: '1.0.0',
        name: 'Payment Processing',
        category: 'Financial',
        description: 'Payment and transaction processing functionality',
        commonEndpoints: '/payment, /checkout, /transaction, /billing',
        notes: 'Test for price manipulation, race conditions, business logic flaws',
        diagramMd: null,
        commonVectors: 'Price manipulation, Race conditions, Business logic bypass',
        createdBy: 'system',
        modifiedBy: 'system'
      }
    ];

    sampleFuncTemplates.forEach(template => addFunctionalityTemplate(template));
  }

  // Behavior Templates
  if (getBehaviorTemplates().length === 0) {
    const sampleBehaviorTemplates = [
      {
        workspaceId: 'default-workspace',
        version: '1.0.0',
        name: 'URL Encodes User Input',
        description: 'The application properly URL-encodes user input before processing',
        isGood: true,
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        workspaceId: 'default-workspace',
        version: '1.0.0',
        name: 'Validates File Extensions',
        description: 'The application validates file extensions on upload',
        isGood: true,
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        workspaceId: 'default-workspace',
        version: '1.0.0',
        name: 'Client-Side Validation Only',
        description: 'The application relies only on client-side validation',
        isGood: false,
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        workspaceId: 'default-workspace',
        version: '1.0.0',
        name: 'Exposes Error Messages',
        description: 'The application exposes detailed error messages to users',
        isGood: false,
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        workspaceId: 'default-workspace',
        version: '1.0.0',
        name: 'Implements Rate Limiting',
        description: 'The application implements proper rate limiting on sensitive endpoints',
        isGood: true,
        createdBy: 'system',
        modifiedBy: 'system'
      }
    ];

    sampleBehaviorTemplates.forEach(template => addBehaviorTemplate(template));
  }
};
