import { v4 as uuidv4 } from 'uuid';
import {
  ProgramStatus,
  AssetType,
  VulnSeverity
} from '@/types';
import { userStorage } from './local-storage';
import { workspaceStorage } from './local-storage-part2';
import { programStorage, assetStorage } from './local-storage-part2';
import { vulnerabilityStorage, methodologyStorage, methodologyCategoryStorage, playbookStorage } from './local-storage-part3';

// Initialize demo data if needed
export const initializeDemoData = (): void => {
  // Check if we already have data
  const users = userStorage.getAll();
  if (users.length > 0) {
    return;
  }
  
  try {
    // Create a demo user
    const demoUser = userStorage.create('demo@nimbusva.ult', 'demo123', 'Demo User');
    
    // Create a demo workspace
    const workspace = workspaceStorage.create({
      name: 'Demo Workspace',
      descr: 'This is a demo workspace for testing Nimbus Vault',
      ownerId: demoUser.id
    });
    
    // Create a demo program
    const program = programStorage.create({
      workspaceId: workspace.id,
      name: 'Demo Security Program',
      descr: 'A demo security testing program',
      status: ProgramStatus.Active,
      ownerId: demoUser.id
    });
    
    // Create demo assets
    assetStorage.create({
      workspaceId: workspace.id,
      programId: program.id,
      name: 'Demo Web Application',
      url: 'https://demo.example.com',
      type: AssetType.WebApplication,
      descr: 'Demo web application for security testing',
      tags: ['web', 'demo'],
      ownerId: demoUser.id
    });
    
    // Create demo vulnerabilities
    const sqlInjection = vulnerabilityStorage.create({
      workspaceId: workspace.id,
      name: 'SQL Injection',
      description: 'SQL injection vulnerability allows attackers to manipulate database queries',
      severity: VulnSeverity.Critical,
      createdBy: demoUser.id
    });
    
    const xss = vulnerabilityStorage.create({
      workspaceId: workspace.id,
      name: 'Cross-site Scripting (XSS)',
      description: 'XSS allows attackers to inject client-side scripts into web pages',
      severity: VulnSeverity.High,
      createdBy: demoUser.id
    });
    
    // Create methodology categories
    const webCategory = methodologyCategoryStorage.create({
      workspaceId: workspace.id,
      name: 'Web Applications',
      descr: 'Testing methodologies for web applications'
    });
    
    const apiCategory = methodologyCategoryStorage.create({
      workspaceId: workspace.id,
      name: 'API Security',
      descr: 'Testing methodologies for API security'
    });
    
    // Create methodologies
    const sqlInjectionMethodology = methodologyStorage.create({
      workspaceId: workspace.id,
      vulnClassId: sqlInjection.id,
      categoryId: webCategory.id,
      name: 'SQL Injection Testing',
      description: 'Methodology for testing and exploiting SQL injection vulnerabilities',
      createdBy: demoUser.id
    });
    
    const xssMethodology = methodologyStorage.create({
      workspaceId: workspace.id,
      vulnClassId: xss.id,
      categoryId: webCategory.id,
      name: 'XSS Testing',
      description: 'Methodology for testing and exploiting Cross-site Scripting vulnerabilities',
      createdBy: demoUser.id
    });
    
    // Create playbooks
    playbookStorage.create({
      workspaceId: workspace.id,
      methodologyId: sqlInjectionMethodology.id,
      name: 'SQL Injection Testing Playbook',
      description: 'Step-by-step guide for identifying and exploiting SQL injection vulnerabilities',
      contentMd: '# SQL Injection Testing\n\n## 1. Identification\n- Test for error-based SQL injection\n- Test for blind SQL injection\n\n## 2. Exploitation\n- Extract database schema\n- Access sensitive data\n\n## 3. Remediation\n- Use parameterized queries\n- Implement input validation',
      diagramMd: 'graph TD;\nA[Start] --> B[Test Input Fields];\nB --> C{Vulnerable?};\nC -->|Yes| D[Exploit];\nC -->|No| E[Document];\nD --> F[Document];\nE --> G[End];\nF --> G;',
      contextTags: ['web', 'database', 'sql-injection'],
      createdBy: demoUser.id
    });
    
    playbookStorage.create({
      workspaceId: workspace.id,
      methodologyId: xssMethodology.id,
      name: 'XSS Testing Playbook',
      description: 'Guide for testing and exploiting XSS vulnerabilities',
      contentMd: '# Cross-site Scripting Testing\n\n## 1. Identification\n- Test for reflected XSS\n- Test for stored XSS\n- Test for DOM-based XSS\n\n## 2. Exploitation\n- Create proof-of-concept\n- Demonstrate impact\n\n## 3. Remediation\n- Implement output encoding\n- Use Content-Security-Policy',
      diagramMd: 'graph TD;\nA[Start] --> B[Identify Input Points];\nB --> C[Test Input Reflection];\nC --> D{Reflected?};\nD -->|Yes| E[Test Script Execution];\nD -->|No| F[Document];\nE --> G{Executes?};\nG -->|Yes| H[Create PoC];\nG -->|No| F;\nH --> F;\nF --> I[End];',
      contextTags: ['web', 'javascript', 'xss'],
      createdBy: demoUser.id
    });
    
    console.log('Demo data initialized successfully');
  } catch (error) {
    console.error('Error initializing demo data:', error);
  }
};