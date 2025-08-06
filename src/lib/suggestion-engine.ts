import type {
  Asset,
  AssetTechnology,
  AssetFunctionality,
  AssetBehavior,
  TechnologyTemplate,
  FunctionalityTemplate,
  BehaviorTemplate,
  VulnClass,
  Technique,
  PayloadList,
  Playbook,
  Methodology,
  TechniqueTag,
  VulnerabilitySeverity
} from '@/types';

// Suggestion Types
export interface Suggestion {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  relevantTo: string[];
  confidence: number; // 0-100
  category?: string;
  priority: SuggestionPriority;
  contextTags: string[];
  resourceId?: string; // ID of the suggested resource
}

export enum SuggestionType {
  TECHNOLOGY = 'technology',
  FUNCTIONALITY = 'functionality',
  BEHAVIOR = 'behavior',
  VULNERABILITY_CLASS = 'vulnerability_class',
  TECHNIQUE = 'technique',
  PAYLOAD = 'payload',
  PLAYBOOK = 'playbook',
  METHODOLOGY = 'methodology'
}

export enum SuggestionPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface SuggestionContext {
  assetId: string;
  assetType: string;
  assignedTechnologies: AssetTechnology[];
  assignedFunctionalities: AssetFunctionality[];
  assignedBehaviors: AssetBehavior[];
  contextTags?: string[];
}

// Rule-based suggestion mappings
interface SuggestionRule {
  id: string;
  name: string;
  conditions: RuleCondition[];
  suggestions: SuggestionTemplate[];
  priority: SuggestionPriority;
}

interface RuleCondition {
  type: 'technology' | 'functionality' | 'behavior' | 'asset_type';
  value: string;
  operator: 'equals' | 'contains' | 'in';
}

interface SuggestionTemplate {
  type: SuggestionType;
  title: string;
  description: string;
  confidence: number;
  category?: string;
  resourceId?: string;
}

/**
 * Nimbus Vault Suggestion Engine
 * 
 * This engine provides contextually relevant recommendations based on:
 * - Asset context (type, technologies, functionalities, behaviors)
 * - Pre-defined ontological relationships
 * - Rule-based logic (not AI/ML)
 * 
 * The engine guides security researchers by suggesting relevant vulnerabilities,
 * techniques, payloads, and methodologies.
 */
class SuggestionEngine {
  private rules: SuggestionRule[] = [];
  
  constructor() {
    this.initializeDefaultRules();
  }

  /**
   * Initialize default rule-based mappings for common scenarios
   */
  private initializeDefaultRules(): void {
    this.rules = [
      // React Technology Rules
      {
        id: 'react-xss-rules',
        name: 'React XSS Vulnerabilities',
        conditions: [
          { type: 'technology', value: 'React', operator: 'equals' }
        ],
        suggestions: [
          {
            type: SuggestionType.VULNERABILITY_CLASS,
            title: 'Cross-Site Scripting (XSS)',
            description: 'DOM-based XSS vulnerabilities in React components',
            confidence: 85,
            category: 'Injection'
          },
          {
            type: SuggestionType.TECHNIQUE,
            title: 'JSX Injection Testing',
            description: 'Test for unsafe JSX rendering and component injection',
            confidence: 80,
            category: 'Injection Testing'
          },
          {
            type: SuggestionType.BEHAVIOR,
            title: 'Unsafe HTML Rendering',
            description: 'Behavior where dangerouslySetInnerHTML is used',
            confidence: 90
          }
        ],
        priority: SuggestionPriority.HIGH
      },

      // File Upload Functionality Rules
      {
        id: 'file-upload-rules',
        name: 'File Upload Security',
        conditions: [
          { type: 'functionality', value: 'File Upload', operator: 'contains' }
        ],
        suggestions: [
          {
            type: SuggestionType.VULNERABILITY_CLASS,
            title: 'Unrestricted File Upload',
            description: 'Arbitrary file upload leading to RCE',
            confidence: 95,
            category: 'Upload'
          },
          {
            type: SuggestionType.PLAYBOOK,
            title: 'File Upload RCE Workflow',
            description: 'Step-by-step file upload exploitation methodology',
            confidence: 90,
            category: 'Exploitation'
          },
          {
            type: SuggestionType.TECHNIQUE,
            title: 'Extension Validation Bypass',
            description: 'Techniques to bypass file extension restrictions',
            confidence: 85,
            category: 'Bypass'
          },
          {
            type: SuggestionType.BEHAVIOR,
            title: 'Client-Side Validation Only',
            description: 'File validation performed only on client side',
            confidence: 80
          }
        ],
        priority: SuggestionPriority.CRITICAL
      },

      // Apache Struts Rules
      {
        id: 'struts-rules',
        name: 'Apache Struts Vulnerabilities',
        conditions: [
          { type: 'technology', value: 'Apache Struts', operator: 'contains' }
        ],
        suggestions: [
          {
            type: SuggestionType.VULNERABILITY_CLASS,
            title: 'Remote Code Execution',
            description: 'Known RCE vulnerabilities in Apache Struts',
            confidence: 95,
            category: 'RCE'
          },
          {
            type: SuggestionType.TECHNIQUE,
            title: 'OGNL Injection',
            description: 'Object-Graph Navigation Language injection attacks',
            confidence: 90,
            category: 'Injection'
          },
          {
            type: SuggestionType.PAYLOAD,
            title: 'Struts2 RCE Payloads',
            description: 'Known payloads for Struts2 RCE vulnerabilities',
            confidence: 95,
            resourceId: 'struts2-payloads'
          }
        ],
        priority: SuggestionPriority.CRITICAL
      },

      // Authentication Functionality Rules
      {
        id: 'auth-rules',
        name: 'Authentication Security',
        conditions: [
          { type: 'functionality', value: 'Authentication', operator: 'contains' }
        ],
        suggestions: [
          {
            type: SuggestionType.VULNERABILITY_CLASS,
            title: 'Broken Authentication',
            description: 'Authentication bypass and session management flaws',
            confidence: 80,
            category: 'Authentication'
          },
          {
            type: SuggestionType.TECHNIQUE,
            title: 'Session Fixation Testing',
            description: 'Test for session fixation vulnerabilities',
            confidence: 75,
            category: 'Session'
          },
          {
            type: SuggestionType.BEHAVIOR,
            title: 'Weak Password Policy',
            description: 'Password complexity requirements are insufficient',
            confidence: 70
          }
        ],
        priority: SuggestionPriority.HIGH
      },

      // Spring Boot Rules
      {
        id: 'spring-boot-rules',
        name: 'Spring Boot Security',
        conditions: [
          { type: 'technology', value: 'Spring Boot', operator: 'contains' }
        ],
        suggestions: [
          {
            type: SuggestionType.VULNERABILITY_CLASS,
            title: 'Spring Boot Actuator Exposure',
            description: 'Exposed management endpoints in Spring Boot',
            confidence: 85,
            category: 'Information Disclosure'
          },
          {
            type: SuggestionType.TECHNIQUE,
            title: 'Actuator Endpoint Enumeration',
            description: 'Enumerate and test Spring Boot actuator endpoints',
            confidence: 90,
            category: 'Enumeration'
          }
        ],
        priority: SuggestionPriority.MEDIUM
      },

      // WordPress Rules
      {
        id: 'wordpress-rules',
        name: 'WordPress Security',
        conditions: [
          { type: 'technology', value: 'WordPress', operator: 'contains' }
        ],
        suggestions: [
          {
            type: SuggestionType.VULNERABILITY_CLASS,
            title: 'WordPress Plugin Vulnerabilities',
            description: 'Common vulnerabilities in WordPress plugins',
            confidence: 90,
            category: 'CMS'
          },
          {
            type: SuggestionType.PLAYBOOK,
            title: 'WordPress Security Assessment',
            description: 'Comprehensive WordPress security testing methodology',
            confidence: 85,
            category: 'CMS Testing'
          }
        ],
        priority: SuggestionPriority.HIGH
      },

      // Combination Rules (Technology + Functionality)
      {
        id: 'php-upload-rules',
        name: 'PHP File Upload',
        conditions: [
          { type: 'technology', value: 'PHP', operator: 'contains' },
          { type: 'functionality', value: 'Upload', operator: 'contains' }
        ],
        suggestions: [
          {
            type: SuggestionType.TECHNIQUE,
            title: 'PHP File Inclusion via Upload',
            description: 'Exploit file upload to achieve Local/Remote File Inclusion',
            confidence: 95,
            category: 'File Inclusion'
          },
          {
            type: SuggestionType.BEHAVIOR,
            title: 'Insufficient File Type Validation',
            description: 'PHP files can be uploaded with alternate extensions',
            confidence: 90
          },
          {
            type: SuggestionType.PAYLOAD,
            title: 'PHP Web Shell Payloads',
            description: 'PHP web shells for file upload exploitation',
            confidence: 95,
            resourceId: 'php-webshells'
          }
        ],
        priority: SuggestionPriority.CRITICAL
      }
    ];
  }

  /**
   * Generate suggestions based on current asset context
   */
  public generateSuggestions(context: SuggestionContext): Suggestion[] {
    const suggestions: Suggestion[] = [];
    let suggestionIdCounter = 1;

    // Evaluate each rule against the context
    for (const rule of this.rules) {
      if (this.evaluateRule(rule, context)) {
        // Rule matches - generate suggestions
        for (const template of rule.suggestions) {
          const suggestion: Suggestion = {
            id: `suggestion-${suggestionIdCounter++}`,
            type: template.type,
            title: template.title,
            description: template.description,
            relevantTo: this.extractRelevantContext(rule.conditions, context),
            confidence: template.confidence,
            category: template.category,
            priority: rule.priority,
            contextTags: this.generateContextTags(context),
            resourceId: template.resourceId
          };

          suggestions.push(suggestion);
        }
      }
    }

    // Sort by priority and confidence
    return suggestions.sort((a, b) => {
      const priorityOrder = {
        [SuggestionPriority.CRITICAL]: 4,
        [SuggestionPriority.HIGH]: 3,
        [SuggestionPriority.MEDIUM]: 2,
        [SuggestionPriority.LOW]: 1
      };

      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return b.confidence - a.confidence;
    });
  }

  /**
   * Evaluate if a rule's conditions match the current context
   */
  private evaluateRule(rule: SuggestionRule, context: SuggestionContext): boolean {
    return rule.conditions.every(condition => {
      switch (condition.type) {
        case 'technology':
          return this.evaluateTechnologyCondition(condition, context.assignedTechnologies);
        case 'functionality':
          return this.evaluateFunctionalityCondition(condition, context.assignedFunctionalities);
        case 'behavior':
          return this.evaluateBehaviorCondition(condition, context.assignedBehaviors);
        case 'asset_type':
          return this.evaluateAssetTypeCondition(condition, context.assetType);
        default:
          return false;
      }
    });
  }

  /**
   * Evaluate technology-based conditions
   */
  private evaluateTechnologyCondition(condition: RuleCondition, technologies: AssetTechnology[]): boolean {
    switch (condition.operator) {
      case 'equals':
        return technologies.some(tech => tech.name === condition.value);
      case 'contains':
        return technologies.some(tech => tech.name.toLowerCase().includes(condition.value.toLowerCase()));
      case 'in':
        return technologies.some(tech => condition.value.split(',').includes(tech.name));
      default:
        return false;
    }
  }

  /**
   * Evaluate functionality-based conditions
   */
  private evaluateFunctionalityCondition(condition: RuleCondition, functionalities: AssetFunctionality[]): boolean {
    switch (condition.operator) {
      case 'equals':
        return functionalities.some(func => func.name === condition.value);
      case 'contains':
        return functionalities.some(func => 
          func.name.toLowerCase().includes(condition.value.toLowerCase()) ||
          (func.category && func.category.toLowerCase().includes(condition.value.toLowerCase()))
        );
      case 'in':
        return functionalities.some(func => condition.value.split(',').includes(func.name));
      default:
        return false;
    }
  }

  /**
   * Evaluate behavior-based conditions
   */
  private evaluateBehaviorCondition(condition: RuleCondition, behaviors: AssetBehavior[]): boolean {
    switch (condition.operator) {
      case 'equals':
        return behaviors.some(behavior => behavior.name === condition.value);
      case 'contains':
        return behaviors.some(behavior => behavior.name.toLowerCase().includes(condition.value.toLowerCase()));
      case 'in':
        return behaviors.some(behavior => condition.value.split(',').includes(behavior.name));
      default:
        return false;
    }
  }

  /**
   * Evaluate asset type conditions
   */
  private evaluateAssetTypeCondition(condition: RuleCondition, assetType: string): boolean {
    switch (condition.operator) {
      case 'equals':
        return assetType === condition.value;
      case 'contains':
        return assetType.toLowerCase().includes(condition.value.toLowerCase());
      case 'in':
        return condition.value.split(',').includes(assetType);
      default:
        return false;
    }
  }

  /**
   * Extract relevant context items that triggered the rule
   */
  private extractRelevantContext(conditions: RuleCondition[], context: SuggestionContext): string[] {
    const relevant: string[] = [];

    conditions.forEach(condition => {
      switch (condition.type) {
        case 'technology':
          context.assignedTechnologies.forEach(tech => {
            if (this.evaluateTechnologyCondition(condition, [tech])) {
              relevant.push(tech.name);
            }
          });
          break;
        case 'functionality':
          context.assignedFunctionalities.forEach(func => {
            if (this.evaluateFunctionalityCondition(condition, [func])) {
              relevant.push(func.name);
            }
          });
          break;
        case 'behavior':
          context.assignedBehaviors.forEach(behavior => {
            if (this.evaluateBehaviorCondition(condition, [behavior])) {
              relevant.push(behavior.name);
            }
          });
          break;
        case 'asset_type':
          if (this.evaluateAssetTypeCondition(condition, context.assetType)) {
            relevant.push(context.assetType);
          }
          break;
      }
    });

    return relevant;
  }

  /**
   * Generate context tags for better suggestion categorization
   */
  private generateContextTags(context: SuggestionContext): string[] {
    const tags: string[] = [];

    // Add asset type tag
    tags.push(`asset:${context.assetType.toLowerCase().replace(/\s+/g, '-')}`);

    // Add technology tags
    context.assignedTechnologies.forEach(tech => {
      tags.push(`tech:${tech.name.toLowerCase().replace(/\s+/g, '-')}`);
      if (tech.category) {
        tags.push(`tech-category:${tech.category.toLowerCase().replace(/\s+/g, '-')}`);
      }
    });

    // Add functionality tags
    context.assignedFunctionalities.forEach(func => {
      tags.push(`func:${func.name.toLowerCase().replace(/\s+/g, '-')}`);
      if (func.category) {
        tags.push(`func-category:${func.category.toLowerCase().replace(/\s+/g, '-')}`);
      }
    });

    // Add behavior tags
    context.assignedBehaviors.forEach(behavior => {
      tags.push(`behavior:${behavior.name.toLowerCase().replace(/\s+/g, '-')}`);
    });

    return [...new Set(tags)]; // Remove duplicates
  }

  /**
   * Add custom rules at runtime
   */
  public addRule(rule: SuggestionRule): void {
    this.rules.push(rule);
  }

  /**
   * Remove a rule by ID
   */
  public removeRule(ruleId: string): void {
    this.rules = this.rules.filter(rule => rule.id !== ruleId);
  }

  /**
   * Get all active rules
   */
  public getRules(): SuggestionRule[] {
    return [...this.rules];
  }

  /**
   * Filter suggestions by type
   */
  public filterSuggestionsByType(suggestions: Suggestion[], type: SuggestionType): Suggestion[] {
    return suggestions.filter(suggestion => suggestion.type === type);
  }

  /**
   * Get high-confidence suggestions only
   */
  public getHighConfidenceSuggestions(suggestions: Suggestion[], threshold: number = 80): Suggestion[] {
    return suggestions.filter(suggestion => suggestion.confidence >= threshold);
  }
}

// Export singleton instance
export const suggestionEngine = new SuggestionEngine();

// Export types and classes for external use
export {
  SuggestionEngine,
  type SuggestionRule,
  type RuleCondition,
  type SuggestionTemplate
};
