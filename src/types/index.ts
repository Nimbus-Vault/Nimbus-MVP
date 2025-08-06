// Enum Types
export enum ProgramStatus {
  Active = 'Active',
  Paused = 'Paused',
  Ended = 'Ended'
}

export enum VulnerabilitySeverity {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export enum AssetType {
  WebApplication = 'Web Application',
  APIEndpoint = 'API Endpoint',
  MobileApplication = 'Mobile Application',
  Database = 'Database',
  Server = 'Server',
  MobileApp = 'Mobile App',
  Subdomain = 'Subdomain',
  IoTDevice = 'IoT Device',
  Wildcard = 'Wildcard'
}

export enum FlawType {
  Misconfiguration = 'Misconfiguration',
  Implementation = 'Implementation',
  Design = 'Design',
  Logic = 'Logic'
}

export enum TechniqueTag {
  Probing = 'Probing',
  Fuzzing = 'Fuzzing',
  Exploitation = 'Exploitation',
  Enumeration = 'Enumeration',
  Bypass = 'Bypass'
}

// Alias for backward compatibility
export const VulnSeverity = VulnerabilitySeverity;

// Basic User Types
export interface User {
  id: string;
  email: string;
  fullName?: string | null;
  createdAt: string;
  lastLogin?: string | null;
  isActive: boolean;
}

export interface Role {
  id: string;
  name: string;
}

// Workspace Types
export interface Workspace {
  id: string;
  name: string;
  description?: string | null;
  createdBy: string;
  ownerId?: string;
  createdAt: string;
  isPublic: boolean;
}

export interface WorkspaceMember {
  workspaceId: string;
  userId: string;
  roleId: string;
}

export interface WorkspaceShare {
  id: string;
  workspaceId: string;
  sharedWith: string;
  accessLevel: string;
  sharedBy: string;
  sharedAt: string;
  expiresAt?: string | null;
}

// Platform & Program Types
export interface Platform {
  id: string;
  workspaceId: string;
  name: string;
  platformUrl?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  popularityRank?: number | null;
  reportTemplate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  workspaceId: string;
  platformId: string;
  name: string;
  description?: string | null;
  programUrl?: string | null;
  status: ProgramStatus;
  launchDate?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScopeType {
  id: string;
  workspaceId: string;
  name: string;
  description?: string | null;
}

// Asset Types
export interface Asset {
  id: string;
  workspaceId: string;
  programId: string;
  name: string;
  assetType: string;
  assetUrl?: string | null;
  discoveredAt?: string | null;
  lastTestedAt?: string | null;
  notesMd?: string | null;
  contextTags?: any | null;
  createdAt: string;
  updatedAt: string;
}

// Vulnerability Types
export interface VulnClass {
  id: string;
  workspaceId: string;
  name: string;
  severity: VulnerabilitySeverity;
  description?: string | null;
  createdBy?: string | null;
  createdAt: string;
}

// Methodology Types
export interface MethodologyCategory {
  id: string;
  workspaceId: string;
  name: string;
  descr?: string | null;
}

export interface Methodology {
  id: string;
  workspaceId: string;
  vulnClassId: string;
  categoryId: string;
  name: string;
  description?: string | null;
  createdBy?: string | null;
  createdAt: string;
}

// Playbook Types
export interface Playbook {
  id: string;
  workspaceId: string;
  methodologyId: string;
  name: string;
  description?: string | null;
  contentMd?: string | null;
  diagramMd?: string | null;
  contextTags?: any | null;
  createdBy?: string | null;
  createdAt: string;
}

// Template Types
export interface TechnologyTemplate {
  id: string;
  workspaceId: string;
  version: string;
  name: string;
  vendor?: string | null;
  category?: string | null;
  docUrl?: string | null;
  description?: string | null;
  createdBy?: string | null;
  createdAt: string;
  modifiedBy?: string | null;
  modifiedAt: string;
}

export interface FunctionalityTemplate {
  id: string;
  workspaceId: string;
  version: string;
  name: string;
  category?: string | null;
  description?: string | null;
  commonEndpoints?: string | null;
  notes?: string | null;
  diagramMd?: string | null;
  commonVectors?: string | null;
  createdBy?: string | null;
  createdAt: string;
  modifiedBy?: string | null;
  modifiedAt: string;
}

// Core Missing Entity Types from Specification

// Behavior Types
export interface BehaviorTemplate {
  id: string;
  workspaceId: string;
  version: string;
  name: string;
  description?: string | null;
  isGood: boolean;
  createdBy?: string | null;
  createdAt: string;
  modifiedBy?: string | null;
  modifiedAt: string;
}

// Technique Types
export interface Technique {
  id: string;
  workspaceId: string;
  name: string;
  tags: TechniqueTag[];
  description?: string | null;
  contentMd?: string | null;
  technologyId?: string | null;
  functionalityId?: string | null;
  behaviorId?: string | null;
  bypass: boolean;
  createdBy?: string | null;
  createdAt: string;
}

// Payload Types
export interface PayloadList {
  id: string;
  workspaceId: string;
  name: string;
  techniqueId?: string | null;
  vulnClassId?: string | null;
  description?: string | null;
  payloadContent?: string | null;
  createdBy?: string | null;
  createdAt: string;
}

// Non-Pattern Driven Types
export interface AtomicVulnerability {
  id: string;
  workspaceId: string;
  title: string;
  flawType: FlawType;
  technologyId?: string | null;
  detectionExploitationMd?: string | null;
  chainable: boolean;
  chainableVulnId?: string | null;
  createdBy?: string | null;
  createdAt: string;
}

export interface LogicFlaw {
  id: string;
  workspaceId: string;
  title: string;
  functionalityId?: string | null;
  technologyId?: string | null;
  workflowDiagramMd?: string | null;
  detectionTestsMd?: string | null;
  chainable: boolean;
  chainableVulnId?: string | null;
  createdBy?: string | null;
  createdAt: string;
}

// Asset Assignment Types (copies of templates)
export interface AssetFunctionality {
  id: string;
  assetId: string;
  functionalityTemplateId: string;
  name: string;
  category?: string | null;
  description?: string | null;
  commonEndpoints?: string | null;
  notes?: string | null;
  diagramMd?: string | null;
  commonVectors?: string | null;
  assignedAt: string;
}

export interface AssetTechnology {
  id: string;
  assetId: string;
  technologyTemplateId: string;
  name: string;
  vendor?: string | null;
  category?: string | null;
  docUrl?: string | null;
  description?: string | null;
  defaultConfigs?: string | null;
  assignedAt: string;
}

export interface AssetBehavior {
  id: string;
  assetId: string;
  behaviorTemplateId: string;
  name: string;
  description?: string | null;
  isGood: boolean;
  assignedAt: string;
}

// Functionality-specific behavior assignment
export interface FunctionalityBehavior {
  id: string;
  functionalityId: string;
  behaviorTemplateId: string;
  name: string;
  description?: string | null;
  isGood: boolean;
  assignedAt: string;
}

// Technology-specific behavior assignment
export interface TechnologyBehavior {
  id: string;
  technologyId: string;
  behaviorTemplateId: string;
  name: string;
  description?: string | null;
  isGood: boolean;
  assignedAt: string;
}

// Dashboard Data Types
export interface DashboardStats {
  workspaces: number;
  programs: {
    total: number;
    active: number;
    paused: number;
    ended: number;
  };
  assets: number;
  vulnerabilities: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  platforms: number;
  techniques: number;
  payloads: number;
}

export interface Activity {
  id: string;
  action: string;
  resource: string;
  timestamp: string;
  user: string;
}

// Authentication Types
export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
}

// Join Types for complex queries
export interface WorkspaceMemberWithDetails extends WorkspaceMember {
  user?: User;
  role?: Role;
}

export interface ProgramWithPlatform extends Program {
  platform?: Platform;
}

export interface MethodologyWithVulnClass extends Methodology {
  vulnClass?: VulnClass;
  category?: MethodologyCategory;
}

export interface PlaybookWithMethodology extends Playbook {
  methodology?: Methodology;
}

export interface AssetWithProgram extends Asset {
  program?: Program;
}