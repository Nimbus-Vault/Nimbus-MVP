import { supabase, formatError } from './supabase';
import {
   Role,
   Workspace,
   WorkspaceMember,
   WorkspaceShare,
   ScopeType,
   Technique,
   PayloadList,
   AtomicVulnerability,
   LogicFlaw,
   FunctionalityBehavior,
   TechnologyBehavior,
   FlawType,
   TechniqueTag
 } from '@/types';

// Additional interfaces for entities not defined in types
interface WorkspaceWithMembers extends Workspace {
 members?: WorkspaceMember[];
}

// Additional interfaces for entities not defined in types
interface AuditLog {
   id: string;
   workspaceId: string | null;
   actorUserId: string;
   action: string;
   resource: string;
   resourceId: string;
   timestamp: string;
   ipAddress: string;
 }

 interface BountyTier {
   id: string;
   programId: string;
   amount: number;
   currencyCode: string;
   rewardType: string | null;
 }

 interface EntityTag {
   tagId: string;
   entity: string;
   entityId: string;
 }

 interface Gadget {
   id: string;
   workspaceId: string;
   name: string;
   description: string | null;
   createdBy: string | null;
   createdAt: string;
 }

 interface GadgetPlaybook {
   gadgetId: string;
   playbookId: string;
 }

 interface MethodologyRevision {
   id: string;
   workspaceId: string;
   methodologyId: string;
   version: string;
   changesMd: string | null;
   createdAt: string;
 }

 interface PlaybookFunctionality {
   playbookId: string;
   funcTmplId: string;
 }

 interface PlaybookTechnique {
   playbookId: string;
   techniqueId: string;
 }

 interface PlaybookTechnology {
   playbookId: string;
   techTmplId: string;
 }

 interface ProgramScopeType {
   programId: string;
   scopeTypeId: string;
 }

 interface Tag {
   id: string;
   name: string;
 }

 interface TechniqueFunctionality {
   techniqueId: string;
   funcTmplId: string;
 }
interface UserRole {
  userId: string;
  roleId: string;
}


// Audit Log Management Service
export const auditLogService = {
  async getAll(): Promise<AuditLog[]> {
    const { data, error } = await supabase.from('audit_log').select('*');
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(log => ({
      id: log.id,
      workspaceId: log.workspace_id,
      actorUserId: log.actor_user_id,
      action: log.action,
      resource: log.resource,
      resourceId: log.resource_id,
      timestamp: log.timestamp,
      ipAddress: log.ip_address
    }));
  },
  
  async getById(id: string): Promise<AuditLog | null> {
    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      actorUserId: data.actor_user_id,
      action: data.action,
      resource: data.resource,
      resourceId: data.resource_id,
      timestamp: data.timestamp,
      ipAddress: data.ip_address
    };
  },
  
  async getByWorkspace(workspaceId: string): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .eq('workspace_id', workspaceId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(log => ({
      id: log.id,
      workspaceId: log.workspace_id,
      actorUserId: log.actor_user_id,
      action: log.action,
      resource: log.resource,
      resourceId: log.resource_id,
      timestamp: log.timestamp,
      ipAddress: log.ip_address
    }));
  },
  
  async create(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const { data, error } = await supabase
      .from('audit_log')
      .insert({
        workspace_id: log.workspaceId,
        actor_user_id: log.actorUserId,
        action: log.action,
        resource: log.resource,
        resource_id: log.resourceId,
        ip_address: log.ipAddress
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      actorUserId: data.actor_user_id,
      action: data.action,
      resource: data.resource,
      resourceId: data.resource_id,
      timestamp: data.timestamp,
      ipAddress: data.ip_address
    };
  },
  
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('audit_log').delete().eq('id', id);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Bounty Tier Management Service
export const bountyTierService = {
  async getAll(): Promise<BountyTier[]> {
    const { data, error } = await supabase.from('bounty_tier').select('*');
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(tier => ({
      id: tier.id,
      programId: tier.program_id,
      amount: tier.amount,
      currencyCode: tier.currency_code,
      rewardType: tier.reward_type
    }));
  },
  
  async getById(id: string): Promise<BountyTier | null> {
    const { data, error } = await supabase
      .from('bounty_tier')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      programId: data.program_id,
      amount: data.amount,
      currencyCode: data.currency_code,
      rewardType: data.reward_type
    };
  },
  
  async getByProgram(programId: string): Promise<BountyTier[]> {
    const { data, error } = await supabase
      .from('bounty_tier')
      .select('*')
      .eq('program_id', programId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(tier => ({
      id: tier.id,
      programId: tier.program_id,
      amount: tier.amount,
      currencyCode: tier.currency_code,
      rewardType: tier.reward_type
    }));
  },
  
  async create(tier: Omit<BountyTier, 'id'>): Promise<BountyTier> {
    const { data, error } = await supabase
      .from('bounty_tier')
      .insert({
        program_id: tier.programId,
        amount: tier.amount,
        currency_code: tier.currencyCode,
        reward_type: tier.rewardType
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      programId: data.program_id,
      amount: data.amount,
      currencyCode: data.currency_code,
      rewardType: data.reward_type
    };
  },
  
  async update(id: string, tier: Partial<BountyTier>): Promise<BountyTier> {
    const { data, error } = await supabase
      .from('bounty_tier')
      .update({
        amount: tier.amount,
        currency_code: tier.currencyCode,
        reward_type: tier.rewardType
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      programId: data.program_id,
      amount: data.amount,
      currencyCode: data.currency_code,
      rewardType: data.reward_type
    };
  },
  
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('bounty_tier').delete().eq('id', id);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Entity Tag Management Service
export const entityTagService = {
  async getAll(): Promise<EntityTag[]> {
    const { data, error } = await supabase.from('entity_tag').select('*');
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(tag => ({
      tagId: tag.tag_id,
      entity: tag.entity,
      entityId: tag.entity_id
    }));
  },
  
  async getByEntity(entity: string, entityId: string): Promise<EntityTag[]> {
    const { data, error } = await supabase
      .from('entity_tag')
      .select('*')
      .eq('entity', entity)
      .eq('entity_id', entityId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(tag => ({
      tagId: tag.tag_id,
      entity: tag.entity,
      entityId: tag.entity_id
    }));
  },
  
  async getByTag(tagId: string): Promise<EntityTag[]> {
    const { data, error } = await supabase
      .from('entity_tag')
      .select('*')
      .eq('tag_id', tagId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(tag => ({
      tagId: tag.tag_id,
      entity: tag.entity,
      entityId: tag.entity_id
    }));
  },
  
  async create(tag: EntityTag): Promise<EntityTag> {
    const { data, error } = await supabase
      .from('entity_tag')
      .insert({
        tag_id: tag.tagId,
        entity: tag.entity,
        entity_id: tag.entityId
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      tagId: data.tag_id,
      entity: data.entity,
      entityId: data.entity_id
    };
  },
  
  async delete(tagId: string, entity: string, entityId: string): Promise<boolean> {
    const { error } = await supabase
      .from('entity_tag')
      .delete()
      .eq('tag_id', tagId)
      .eq('entity', entity)
      .eq('entity_id', entityId);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Gadget Management Service
export const gadgetService = {
  async getAll(workspaceId: string): Promise<Gadget[]> {
    const { data, error } = await supabase
      .from('gadget')
      .select('*')
      .eq('workspace_id', workspaceId);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(gadget => ({
      id: gadget.id,
      workspaceId: gadget.workspace_id,
      name: gadget.name,
      description: gadget.description,
      createdBy: gadget.created_by,
      createdAt: gadget.created_at
    }));
  },
  
  async getById(id: string): Promise<Gadget | null> {
    const { data, error } = await supabase
      .from('gadget')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      name: data.name,
      description: data.description,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },
  
  async create(gadget: Omit<Gadget, 'id' | 'createdAt'>): Promise<Gadget> {
    const { data, error } = await supabase
      .from('gadget')
      .insert({
        workspace_id: gadget.workspaceId,
        name: gadget.name,
        description: gadget.description,
        created_by: gadget.createdBy
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      name: data.name,
      description: data.description,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },
  
  async update(id: string, gadget: Partial<Gadget>): Promise<Gadget> {
    const { data, error } = await supabase
      .from('gadget')
      .update({
        name: gadget.name,
        description: gadget.description
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      name: data.name,
      description: data.description,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },
  
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('gadget').delete().eq('id', id);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Gadget Playbook Management Service
export const gadgetPlaybookService = {
  async getAll(): Promise<GadgetPlaybook[]> {
    const { data, error } = await supabase.from('gadget_playbook').select('*');
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(gp => ({
      gadgetId: gp.gadget_id,
      playbookId: gp.playbook_id
    }));
  },
  
  async getByGadget(gadgetId: string): Promise<GadgetPlaybook[]> {
    const { data, error } = await supabase
      .from('gadget_playbook')
      .select('*')
      .eq('gadget_id', gadgetId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(gp => ({
      gadgetId: gp.gadget_id,
      playbookId: gp.playbook_id
    }));
  },
  
  async getByPlaybook(playbookId: string): Promise<GadgetPlaybook[]> {
    const { data, error } = await supabase
      .from('gadget_playbook')
      .select('*')
      .eq('playbook_id', playbookId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(gp => ({
      gadgetId: gp.gadget_id,
      playbookId: gp.playbook_id
    }));
  },
  
  async create(gp: GadgetPlaybook): Promise<GadgetPlaybook> {
    const { data, error } = await supabase
      .from('gadget_playbook')
      .insert({
        gadget_id: gp.gadgetId,
        playbook_id: gp.playbookId
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      gadgetId: data.gadget_id,
      playbookId: data.playbook_id
    };
  },
  
  async delete(gadgetId: string, playbookId: string): Promise<boolean> {
    const { error } = await supabase
      .from('gadget_playbook')
      .delete()
      .eq('gadget_id', gadgetId)
      .eq('playbook_id', playbookId);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Methodology Revision Management Service
export const methodologyRevisionService = {
  async getAll(): Promise<MethodologyRevision[]> {
    const { data, error } = await supabase.from('methodology_revision').select('*');
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(rev => ({
      id: rev.id,
      workspaceId: rev.workspace_id,
      methodologyId: rev.methodology_id,
      version: rev.version,
      changesMd: rev.changes_md,
      createdAt: rev.created_at
    }));
  },
  
  async getById(id: string): Promise<MethodologyRevision | null> {
    const { data, error } = await supabase
      .from('methodology_revision')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      methodologyId: data.methodology_id,
      version: data.version,
      changesMd: data.changes_md,
      createdAt: data.created_at
    };
  },
  
  async getByMethodology(methodologyId: string): Promise<MethodologyRevision[]> {
    const { data, error } = await supabase
      .from('methodology_revision')
      .select('*')
      .eq('methodology_id', methodologyId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(rev => ({
      id: rev.id,
      workspaceId: rev.workspace_id,
      methodologyId: rev.methodology_id,
      version: rev.version,
      changesMd: rev.changes_md,
      createdAt: rev.created_at
    }));
  },
  
  async create(rev: Omit<MethodologyRevision, 'id' | 'createdAt'>): Promise<MethodologyRevision> {
    const { data, error } = await supabase
      .from('methodology_revision')
      .insert({
        workspace_id: rev.workspaceId,
        methodology_id: rev.methodologyId,
        version: rev.version,
        changes_md: rev.changesMd
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      methodologyId: data.methodology_id,
      version: data.version,
      changesMd: data.changes_md,
      createdAt: data.created_at
    };
  },
  
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('methodology_revision').delete().eq('id', id);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Playbook Functionality Management Service
export const playbookFunctionalityService = {
  async getAll(): Promise<PlaybookFunctionality[]> {
    const { data, error } = await supabase.from('playbook_functionality').select('*');
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(pf => ({
      playbookId: pf.playbook_id,
      funcTmplId: pf.func_tmpl_id
    }));
  },
  
  async getByPlaybook(playbookId: string): Promise<PlaybookFunctionality[]> {
    const { data, error } = await supabase
      .from('playbook_functionality')
      .select('*')
      .eq('playbook_id', playbookId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(pf => ({
      playbookId: pf.playbook_id,
      funcTmplId: pf.func_tmpl_id
    }));
  },
  
  async getByFunctionality(funcTmplId: string): Promise<PlaybookFunctionality[]> {
    const { data, error } = await supabase
      .from('playbook_functionality')
      .select('*')
      .eq('func_tmpl_id', funcTmplId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(pf => ({
      playbookId: pf.playbook_id,
      funcTmplId: pf.func_tmpl_id
    }));
  },
  
  async create(pf: PlaybookFunctionality): Promise<PlaybookFunctionality> {
    const { data, error } = await supabase
      .from('playbook_functionality')
      .insert({
        playbook_id: pf.playbookId,
        func_tmpl_id: pf.funcTmplId
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      playbookId: data.playbook_id,
      funcTmplId: data.func_tmpl_id
    };
  },
  
  async delete(playbookId: string, funcTmplId: string): Promise<boolean> {
    const { error } = await supabase
      .from('playbook_functionality')
      .delete()
      .eq('playbook_id', playbookId)
      .eq('func_tmpl_id', funcTmplId);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Playbook Technique Management Service
export const playbookTechniqueService = {
  async getAll(): Promise<PlaybookTechnique[]> {
    const { data, error } = await supabase.from('playbook_technique').select('*');
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(pt => ({
      playbookId: pt.playbook_id,
      techniqueId: pt.technique_id
    }));
  },
  
  async getByPlaybook(playbookId: string): Promise<PlaybookTechnique[]> {
    const { data, error } = await supabase
      .from('playbook_technique')
      .select('*')
      .eq('playbook_id', playbookId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(pt => ({
      playbookId: pt.playbook_id,
      techniqueId: pt.technique_id
    }));
  },
  
  async getByTechnique(techniqueId: string): Promise<PlaybookTechnique[]> {
    const { data, error } = await supabase
      .from('playbook_technique')
      .select('*')
      .eq('technique_id', techniqueId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(pt => ({
      playbookId: pt.playbook_id,
      techniqueId: pt.technique_id
    }));
  },
  
  async create(pt: PlaybookTechnique): Promise<PlaybookTechnique> {
    const { data, error } = await supabase
      .from('playbook_technique')
      .insert({
        playbook_id: pt.playbookId,
        technique_id: pt.techniqueId
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      playbookId: data.playbook_id,
      techniqueId: data.technique_id
    };
  },
  
  async delete(playbookId: string, techniqueId: string): Promise<boolean> {
    const { error } = await supabase
      .from('playbook_technique')
      .delete()
      .eq('playbook_id', playbookId)
      .eq('technique_id', techniqueId);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Playbook Technology Management Service
export const playbookTechnologyService = {
  async getAll(): Promise<PlaybookTechnology[]> {
    const { data, error } = await supabase.from('playbook_technology').select('*');
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(pt => ({
      playbookId: pt.playbook_id,
      techTmplId: pt.tech_tmpl_id
    }));
  },
  
  async getByPlaybook(playbookId: string): Promise<PlaybookTechnology[]> {
    const { data, error } = await supabase
      .from('playbook_technology')
      .select('*')
      .eq('playbook_id', playbookId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(pt => ({
      playbookId: pt.playbook_id,
      techTmplId: pt.tech_tmpl_id
    }));
  },
  
  async getByTechnology(techTmplId: string): Promise<PlaybookTechnology[]> {
    const { data, error } = await supabase
      .from('playbook_technology')
      .select('*')
      .eq('tech_tmpl_id', techTmplId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(pt => ({
      playbookId: pt.playbook_id,
      techTmplId: pt.tech_tmpl_id
    }));
  },
  
  async create(pt: PlaybookTechnology): Promise<PlaybookTechnology> {
    const { data, error } = await supabase
      .from('playbook_technology')
      .insert({
        playbook_id: pt.playbookId,
        tech_tmpl_id: pt.techTmplId
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      playbookId: data.playbook_id,
      techTmplId: data.tech_tmpl_id
    };
  },
  
  async delete(playbookId: string, techTmplId: string): Promise<boolean> {
    const { error } = await supabase
      .from('playbook_technology')
      .delete()
      .eq('playbook_id', playbookId)
      .eq('tech_tmpl_id', techTmplId);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Program Scope Type Management Service
export const programScopeTypeService = {
  async getAll(): Promise<ProgramScopeType[]> {
    const { data, error } = await supabase.from('program_scope_type').select('*');
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(pst => ({
      programId: pst.program_id,
      scopeTypeId: pst.scope_type_id
    }));
  },
  
  async getByProgram(programId: string): Promise<ProgramScopeType[]> {
    const { data, error } = await supabase
      .from('program_scope_type')
      .select('*')
      .eq('program_id', programId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(pst => ({
      programId: pst.program_id,
      scopeTypeId: pst.scope_type_id
    }));
  },
  
  async getByScopeType(scopeTypeId: string): Promise<ProgramScopeType[]> {
    const { data, error } = await supabase
      .from('program_scope_type')
      .select('*')
      .eq('scope_type_id', scopeTypeId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(pst => ({
      programId: pst.program_id,
      scopeTypeId: pst.scope_type_id
    }));
  },
  
  async create(pst: ProgramScopeType): Promise<ProgramScopeType> {
    const { data, error } = await supabase
      .from('program_scope_type')
      .insert({
        program_id: pst.programId,
        scope_type_id: pst.scopeTypeId
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      programId: data.program_id,
      scopeTypeId: data.scope_type_id
    };
  },
  
  async delete(programId: string, scopeTypeId: string): Promise<boolean> {
    const { error } = await supabase
      .from('program_scope_type')
      .delete()
      .eq('program_id', programId)
      .eq('scope_type_id', scopeTypeId);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Tag Management Service
export const tagService = {
  async getAll(): Promise<Tag[]> {
    const { data, error } = await supabase.from('tag').select('*');
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(tag => ({
      id: tag.id,
      name: tag.name
    }));
  },
  
  async getById(id: string): Promise<Tag | null> {
    const { data, error } = await supabase
      .from('tag')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      name: data.name
    };
  },
  
  async getByName(name: string): Promise<Tag | null> {
    const { data, error } = await supabase
      .from('tag')
      .select('*')
      .eq('name', name)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      name: data.name
    };
  },
  
  async create(tag: Omit<Tag, 'id'>): Promise<Tag> {
    const { data, error } = await supabase
      .from('tag')
      .insert({
        name: tag.name
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      name: data.name
    };
  },
  
  async update(id: string, tag: Partial<Tag>): Promise<Tag> {
    const { data, error } = await supabase
      .from('tag')
      .update({
        name: tag.name
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      name: data.name
    };
  },
  
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('tag').delete().eq('id', id);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Technique Functionality Management Service
export const techniqueFunctionalityService = {
  async getAll(): Promise<TechniqueFunctionality[]> {
    const { data, error } = await supabase.from('technique_functionality').select('*');
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(tf => ({
      techniqueId: tf.technique_id,
      funcTmplId: tf.func_tmpl_id
    }));
  },
  
  async getByTechnique(techniqueId: string): Promise<TechniqueFunctionality[]> {
    const { data, error } = await supabase
      .from('technique_functionality')
      .select('*')
      .eq('technique_id', techniqueId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(tf => ({
      techniqueId: tf.technique_id,
      funcTmplId: tf.func_tmpl_id
    }));
  },
  
  async getByFunctionality(funcTmplId: string): Promise<TechniqueFunctionality[]> {
    const { data, error } = await supabase
      .from('technique_functionality')
      .select('*')
      .eq('func_tmpl_id', funcTmplId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(tf => ({
      techniqueId: tf.technique_id,
      funcTmplId: tf.func_tmpl_id
    }));
  },
  
  async create(tf: TechniqueFunctionality): Promise<TechniqueFunctionality> {
    const { data, error } = await supabase
      .from('technique_functionality')
      .insert({
        technique_id: tf.techniqueId,
        func_tmpl_id: tf.funcTmplId
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      techniqueId: data.technique_id,
      funcTmplId: data.func_tmpl_id
    };
  },
  
  async delete(techniqueId: string, funcTmplId: string): Promise<boolean> {
    const { error } = await supabase
      .from('technique_functionality')
      .delete()
      .eq('technique_id', techniqueId)
      .eq('func_tmpl_id', funcTmplId);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// User Role Management Service
export const userRoleService = {
  async getAll(): Promise<UserRole[]> {
    const { data, error } = await supabase.from('user_role').select('*');
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(ur => ({
      userId: ur.user_id,
      roleId: ur.role_id
    }));
  },
  
  async getByUser(userId: string): Promise<UserRole[]> {
    const { data, error } = await supabase
      .from('user_role')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(ur => ({
      userId: ur.user_id,
      roleId: ur.role_id
    }));
  },
  
  async getByRole(roleId: string): Promise<UserRole[]> {
    const { data, error } = await supabase
      .from('user_role')
      .select('*')
      .eq('role_id', roleId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(ur => ({
      userId: ur.user_id,
      roleId: ur.role_id
    }));
  },
  
  async create(ur: UserRole): Promise<UserRole> {
    const { data, error } = await supabase
      .from('user_role')
      .insert({
        user_id: ur.userId,
        role_id: ur.roleId
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      userId: data.user_id,
      roleId: data.role_id
    };
  },
  
  async delete(userId: string, roleId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_role')
      .delete()
      .eq('user_id', userId)
      .eq('role_id', roleId);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Role Management Service
export const roleService = {
  async getAll(): Promise<Role[]> {
    const { data, error } = await supabase.from('role').select('*');
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(role => ({
      id: role.id,
      name: role.name
    }));
  },
  
  async getById(id: string): Promise<Role | null> {
    const { data, error } = await supabase
      .from('role')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      name: data.name
    };
  },
  
  async getByName(name: string): Promise<Role | null> {
    const { data, error } = await supabase
      .from('role')
      .select('*')
      .eq('name', name)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      name: data.name
    };
  },
  
  async create(role: Omit<Role, 'id'>): Promise<Role> {
    const { data, error } = await supabase
      .from('role')
      .insert({
        name: role.name
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      name: data.name
    };
  },
  
  async update(id: string, role: Partial<Role>): Promise<Role> {
    const { data, error } = await supabase
      .from('role')
      .update({
        name: role.name
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      name: data.name
    };
  },
  
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('role').delete().eq('id', id);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Workspace Member Management Service
export const workspaceMemberService = {
  async getAll(): Promise<WorkspaceMember[]> {
    const { data, error } = await supabase.from('workspace_member').select('*');
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(member => ({
      workspaceId: member.workspace_id,
      userId: member.user_id,
      roleId: member.role_id
    }));
  },
  
  async getByWorkspace(workspaceId: string): Promise<WorkspaceMember[]> {
    const { data, error } = await supabase
      .from('workspace_member')
      .select('*')
      .eq('workspace_id', workspaceId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(member => ({
      workspaceId: member.workspace_id,
      userId: member.user_id,
      roleId: member.role_id
    }));
  },
  
  async getByUser(userId: string): Promise<WorkspaceMember[]> {
    const { data, error } = await supabase
      .from('workspace_member')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(member => ({
      workspaceId: member.workspace_id,
      userId: member.user_id,
      roleId: member.role_id
    }));
  },
  
  async create(member: WorkspaceMember): Promise<WorkspaceMember> {
    const { data, error } = await supabase
      .from('workspace_member')
      .insert({
        workspace_id: member.workspaceId,
        user_id: member.userId,
        role_id: member.roleId
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      workspaceId: data.workspace_id,
      userId: data.user_id,
      roleId: data.role_id
    };
  },
  
  async delete(workspaceId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('workspace_member')
      .delete()
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Workspace Share Management Service
export const workspaceShareService = {
  async getAll(): Promise<WorkspaceShare[]> {
    const { data, error } = await supabase.from('workspace_share').select('*');
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(share => ({
      id: share.id,
      workspaceId: share.workspace_id,
      sharedWith: share.shared_with,
      accessLevel: share.access_level,
      sharedBy: share.shared_by,
      sharedAt: share.shared_at,
      expiresAt: share.expires_at
    }));
  },
  
  async getById(id: string): Promise<WorkspaceShare | null> {
    const { data, error } = await supabase
      .from('workspace_share')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      sharedWith: data.shared_with,
      accessLevel: data.access_level,
      sharedBy: data.shared_by,
      sharedAt: data.shared_at,
      expiresAt: data.expires_at
    };
  },
  
  async getByWorkspace(workspaceId: string): Promise<WorkspaceShare[]> {
    const { data, error } = await supabase
      .from('workspace_share')
      .select('*')
      .eq('workspace_id', workspaceId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(share => ({
      id: share.id,
      workspaceId: share.workspace_id,
      sharedWith: share.shared_with,
      accessLevel: share.access_level,
      sharedBy: share.shared_by,
      sharedAt: share.shared_at,
      expiresAt: share.expires_at
    }));
  },
  
  async create(share: Omit<WorkspaceShare, 'id' | 'sharedAt'>): Promise<WorkspaceShare> {
    const { data, error } = await supabase
      .from('workspace_share')
      .insert({
        workspace_id: share.workspaceId,
        shared_with: share.sharedWith,
        access_level: share.accessLevel,
        shared_by: share.sharedBy,
        expires_at: share.expiresAt
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      sharedWith: data.shared_with,
      accessLevel: data.access_level,
      sharedBy: data.shared_by,
      sharedAt: data.shared_at,
      expiresAt: data.expires_at
    };
  },
  
  async update(id: string, share: Partial<WorkspaceShare>): Promise<WorkspaceShare> {
    const { data, error } = await supabase
      .from('workspace_share')
      .update({
        access_level: share.accessLevel,
        expires_at: share.expiresAt
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      sharedWith: data.shared_with,
      accessLevel: data.access_level,
      sharedBy: data.shared_by,
      sharedAt: data.shared_at,
      expiresAt: data.expires_at
    };
  },
  
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('workspace_share').delete().eq('id', id);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Workspace Management Service (extended)
export const extendedWorkspaceService = {
 ...workspaceMemberService,
 
 async getWithMembers(workspaceId: string): Promise<WorkspaceWithMembers | null> {
   const { data, error } = await supabase
     .from('workspace')
     .select(`
       *,
       members:workspace_member(*)
     `)
     .eq('id', workspaceId)
     .single();
     
   if (error) {
     if (error.code === 'PGRST116') {
       return null;
     }
     throw new Error(formatError(error));
   }
   
   return data;
 }
};

// Scope Type Management Service
export const scopeTypeService = {
  async getAll(workspaceId: string): Promise<ScopeType[]> {
    const { data, error } = await supabase
      .from('scope_type')
      .select('*')
      .eq('workspace_id', workspaceId);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(scope => ({
      id: scope.id,
      workspaceId: scope.workspace_id,
      name: scope.name,
      description: scope.description
    }));
  },
  
  async getById(id: string): Promise<ScopeType | null> {
    const { data, error } = await supabase
      .from('scope_type')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      name: data.name,
      description: data.description
    };
  },
  
  async create(scope: Omit<ScopeType, 'id'>): Promise<ScopeType> {
    const { data, error } = await supabase
      .from('scope_type')
      .insert({
        workspace_id: scope.workspaceId,
        name: scope.name,
        description: scope.description
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      name: data.name,
      description: data.description
    };
  },
  
  async update(id: string, scope: Partial<ScopeType>): Promise<ScopeType> {
    const { data, error } = await supabase
      .from('scope_type')
      .update({
        name: scope.name,
        description: scope.description
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      name: data.name,
      description: data.description
    };
  },
  
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('scope_type').delete().eq('id', id);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Technique Management Service
export const techniqueService = {
  async getAll(workspaceId: string): Promise<Technique[]> {
    const { data, error } = await supabase
      .from('technique')
      .select('*')
      .eq('workspace_id', workspaceId);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(technique => ({
      id: technique.id,
      workspaceId: technique.workspace_id,
      name: technique.name,
      tags: technique.tags as TechniqueTag[],
      description: technique.description,
      contentMd: technique.content_md,
      technologyId: technique.technology_id,
      functionalityId: technique.functionality_id,
      behaviorId: technique.behavior_id,
      bypass: technique.bypass,
      createdBy: technique.created_by,
      createdAt: technique.created_at
    }));
  },
  
  async getById(id: string): Promise<Technique | null> {
    const { data, error } = await supabase
      .from('technique')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      name: data.name,
      tags: data.tags as TechniqueTag[],
      description: data.description,
      contentMd: data.content_md,
      technologyId: data.technology_id,
      functionalityId: data.functionality_id,
      behaviorId: data.behavior_id,
      bypass: data.bypass,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },
  
  async create(technique: Omit<Technique, 'id' | 'createdAt'>): Promise<Technique> {
    const { data, error } = await supabase
      .from('technique')
      .insert({
        workspace_id: technique.workspaceId,
        name: technique.name,
        tags: technique.tags as TechniqueTag[],
        description: technique.description,
        content_md: technique.contentMd,
        technology_id: technique.technologyId,
        functionality_id: technique.functionalityId,
        behavior_id: technique.behaviorId,
        bypass: technique.bypass,
        created_by: technique.createdBy
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      name: data.name,
      tags: data.tags as TechniqueTag[],
      description: data.description,
      contentMd: data.content_md,
      technologyId: data.technology_id,
      functionalityId: data.functionality_id,
      behaviorId: data.behavior_id,
      bypass: data.bypass,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },
  
  async update(id: string, technique: Partial<Technique>): Promise<Technique> {
    const { data, error } = await supabase
      .from('technique')
      .update({
        name: technique.name,
        tags: technique.tags as TechniqueTag[],
        description: technique.description,
        content_md: technique.contentMd,
        technology_id: technique.technologyId,
        functionality_id: technique.functionalityId,
        behavior_id: technique.behaviorId,
        bypass: technique.bypass
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      name: data.name,
      tags: data.tags as TechniqueTag[],
      description: data.description,
      contentMd: data.content_md,
      technologyId: data.technology_id,
      functionalityId: data.functionality_id,
      behaviorId: data.behavior_id,
      bypass: data.bypass,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },
  
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('technique').delete().eq('id', id);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Payload Management Service
export const payloadService = {
  async getAll(workspaceId: string): Promise<PayloadList[]> {
    const { data, error } = await supabase
      .from('payload')
      .select('*')
      .eq('workspace_id', workspaceId);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(payload => ({
      id: payload.id,
      workspaceId: payload.workspace_id,
      name: payload.name,
      techniqueId: payload.technique_id,
      vulnClassId: payload.vuln_class_id,
      description: payload.description,
      payloadContent: payload.content,
      createdBy: payload.created_by,
      createdAt: payload.created_at
    }));
  },
  
  async getById(id: string): Promise<PayloadList | null> {
    const { data, error } = await supabase
      .from('payload')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      name: data.name,
      techniqueId: data.technique_id,
      vulnClassId: data.vuln_class_id,
      description: data.description,
      payloadContent: data.content,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },
  
  async create(payload: Omit<PayloadList, 'id' | 'createdAt'>): Promise<PayloadList> {
    const { data, error } = await supabase
      .from('payload')
      .insert({
        workspace_id: payload.workspaceId,
        name: payload.name,
        technique_id: payload.techniqueId,
        vuln_class_id: payload.vulnClassId,
        description: payload.description,
        content: payload.payloadContent,
        created_by: payload.createdBy
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      name: data.name,
      techniqueId: data.technique_id,
      vulnClassId: data.vuln_class_id,
      description: data.description,
      payloadContent: data.content,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },
  
  async update(id: string, payload: Partial<PayloadList>): Promise<PayloadList> {
    const { data, error } = await supabase
      .from('payload')
      .update({
        name: payload.name,
        technique_id: payload.techniqueId,
        vuln_class_id: payload.vulnClassId,
        description: payload.description,
        content: payload.payloadContent
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      name: data.name,
      techniqueId: data.technique_id,
      vulnClassId: data.vuln_class_id,
      description: data.description,
      payloadContent: data.content,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },
  
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('payload').delete().eq('id', id);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Atomic Vulnerability Management Service
export const atomicVulnService = {
  async getAll(workspaceId: string): Promise<AtomicVulnerability[]> {
    const { data, error } = await supabase
      .from('atomic_vuln')
      .select('*')
      .eq('workspace_id', workspaceId);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(vuln => ({
      id: vuln.id,
      workspaceId: vuln.workspace_id,
      title: vuln.title,
      flawType: vuln.flaw_type as FlawType,
      technologyId: vuln.technology,
      detectionExploitationMd: vuln.steps_md,
      chainable: vuln.chainable,
      chainableVulnId: vuln.chain_to_id,
      createdBy: vuln.created_by,
      createdAt: vuln.created_at
    }));
  },
  
  async getById(id: string): Promise<AtomicVulnerability | null> {
    const { data, error } = await supabase
      .from('atomic_vuln')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      title: data.title,
      flawType: data.flaw_type as FlawType,
      technologyId: data.technology,
      detectionExploitationMd: data.steps_md,
      chainable: data.chainable,
      chainableVulnId: data.chain_to_id,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },
  
  async create(vuln: Omit<AtomicVulnerability, 'id' | 'createdAt'>): Promise<AtomicVulnerability> {
    const { data, error } = await supabase
      .from('atomic_vuln')
      .insert({
        workspace_id: vuln.workspaceId,
        title: vuln.title,
        flaw_type: vuln.flawType,
        technology: vuln.technologyId,
        steps_md: vuln.detectionExploitationMd,
        chainable: vuln.chainable,
        chain_to_id: vuln.chainableVulnId,
        created_by: vuln.createdBy
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      title: data.title,
      flawType: data.flaw_type as FlawType,
      technologyId: data.technology,
      detectionExploitationMd: data.steps_md,
      chainable: data.chainable,
      chainableVulnId: data.chain_to_id,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },
  
  async update(id: string, vuln: Partial<AtomicVulnerability>): Promise<AtomicVulnerability> {
    const { data, error } = await supabase
      .from('atomic_vuln')
      .update({
        title: vuln.title,
        flaw_type: vuln.flawType,
        technology: vuln.technologyId,
        steps_md: vuln.detectionExploitationMd,
        chainable: vuln.chainable,
        chain_to_id: vuln.chainableVulnId
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      title: data.title,
      flawType: data.flaw_type as FlawType,
      technologyId: data.technology,
      detectionExploitationMd: data.steps_md,
      chainable: data.chainable,
      chainableVulnId: data.chain_to_id,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },
  
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('atomic_vuln').delete().eq('id', id);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Logic Flaw Management Service
export const logicFlawService = {
  async getAll(workspaceId: string): Promise<LogicFlaw[]> {
    const { data, error } = await supabase
      .from('logic_flaw')
      .select('*')
      .eq('workspace_id', workspaceId);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(flaw => ({
      id: flaw.id,
      workspaceId: flaw.workspace_id,
      title: flaw.title,
      functionalityId: flaw.functionality_id,
      technologyId: flaw.technology_id,
      workflowDiagramMd: flaw.workflow_diagram_md,
      detectionTestsMd: flaw.detection_tests_md,
      chainable: flaw.chainable,
      chainableVulnId: flaw.chain_to_id,
      createdBy: flaw.created_by,
      createdAt: flaw.created_at
    }));
  },
  
  async getById(id: string): Promise<LogicFlaw | null> {
    const { data, error } = await supabase
      .from('logic_flaw')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      title: data.title,
      functionalityId: data.functionality_id,
      technologyId: data.technology_id,
      workflowDiagramMd: data.workflow_diagram_md,
      detectionTestsMd: data.detection_tests_md,
      chainable: data.chainable,
      chainableVulnId: data.chain_to_id,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },
  
  async create(flaw: Omit<LogicFlaw, 'id' | 'createdAt'>): Promise<LogicFlaw> {
    const { data, error } = await supabase
      .from('logic_flaw')
      .insert({
        workspace_id: flaw.workspaceId,
        title: flaw.title,
        functionality_id: flaw.functionalityId,
        technology_id: flaw.technologyId,
        workflow_diagram_md: flaw.workflowDiagramMd,
        detection_tests_md: flaw.detectionTestsMd,
        chainable: flaw.chainable,
        chain_to_id: flaw.chainableVulnId,
        created_by: flaw.createdBy
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      title: data.title,
      functionalityId: data.functionality_id,
      technologyId: data.technology_id,
      workflowDiagramMd: data.workflow_diagram_md,
      detectionTestsMd: data.detection_tests_md,
      chainable: data.chainable,
      chainableVulnId: data.chain_to_id,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },
  
  async update(id: string, flaw: Partial<LogicFlaw>): Promise<LogicFlaw> {
    const { data, error } = await supabase
      .from('logic_flaw')
      .update({
        title: flaw.title,
        functionality_id: flaw.functionalityId,
        technology_id: flaw.technologyId,
        workflow_diagram_md: flaw.workflowDiagramMd,
        detection_tests_md: flaw.detectionTestsMd,
        chainable: flaw.chainable,
        chain_to_id: flaw.chainableVulnId
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      title: data.title,
      functionalityId: data.functionality_id,
      technologyId: data.technology_id,
      workflowDiagramMd: data.workflow_diagram_md,
      detectionTestsMd: data.detection_tests_md,
      chainable: data.chainable,
      chainableVulnId: data.chain_to_id,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  },
  
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('logic_flaw').delete().eq('id', id);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Functionality Behavior Management Service
export const functionalityBehaviorService = {
  async getAll(): Promise<FunctionalityBehavior[]> {
    const { data, error } = await supabase.from('functionality_behavior').select('*');
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(fb => ({
      id: fb.id,
      functionalityId: fb.functionality_id,
      behaviorTemplateId: fb.behavior_template_id,
      name: fb.name,
      description: fb.description,
      isGood: fb.is_good,
      assignedAt: fb.assigned_at
    }));
  },
  
  async getByFunctionality(functionalityId: string): Promise<FunctionalityBehavior[]> {
    const { data, error } = await supabase
      .from('functionality_behavior')
      .select('*')
      .eq('functionality_id', functionalityId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(fb => ({
      id: fb.id,
      functionalityId: fb.functionality_id,
      behaviorTemplateId: fb.behavior_template_id,
      name: fb.name,
      description: fb.description,
      isGood: fb.is_good,
      assignedAt: fb.assigned_at
    }));
  },
  
  async create(fb: Omit<FunctionalityBehavior, 'id' | 'assignedAt'>): Promise<FunctionalityBehavior> {
    const { data, error } = await supabase
      .from('functionality_behavior')
      .insert({
        functionality_id: fb.functionalityId,
        behavior_template_id: fb.behaviorTemplateId,
        name: fb.name,
        description: fb.description,
        is_good: fb.isGood
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      functionalityId: data.functionality_id,
      behaviorTemplateId: data.behavior_template_id,
      name: data.name,
      description: data.description,
      isGood: data.is_good,
      assignedAt: data.assigned_at
    };
  },
  
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('functionality_behavior').delete().eq('id', id);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
  }
};

// Technology Behavior Management Service
export const technologyBehaviorService = {
  async getAll(): Promise<TechnologyBehavior[]> {
    const { data, error } = await supabase.from('technology_behavior').select('*');
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(tb => ({
      id: tb.id,
      technologyId: tb.technology_id,
      behaviorTemplateId: tb.behavior_template_id,
      name: tb.name,
      description: tb.description,
      isGood: tb.is_good,
      assignedAt: tb.assigned_at
    }));
  },
  
  async getByTechnology(technologyId: string): Promise<TechnologyBehavior[]> {
    const { data, error } = await supabase
      .from('technology_behavior')
      .select('*')
      .eq('technology_id', technologyId);
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return data.map(tb => ({
      id: tb.id,
      technologyId: tb.technology_id,
      behaviorTemplateId: tb.behavior_template_id,
      name: tb.name,
      description: tb.description,
      isGood: tb.is_good,
      assignedAt: tb.assigned_at
    }));
  },
  
  async create(tb: Omit<TechnologyBehavior, 'id' | 'assignedAt'>): Promise<TechnologyBehavior> {
    const { data, error } = await supabase
      .from('technology_behavior')
      .insert({
        technology_id: tb.technologyId,
        behavior_template_id: tb.behaviorTemplateId,
        name: tb.name,
        description: tb.description,
        is_good: tb.isGood
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(formatError(error));
    }
    
    return {
      id: data.id,
      technologyId: data.technology_id,
      behaviorTemplateId: data.behavior_template_id,
      name: data.name,
      description: data.description,
      isGood: data.is_good,
      assignedAt: data.assigned_at
    };
  },
  
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('technology_behavior').delete().eq('id', id);
    
    if (error) {
      throw new Error(formatError(error));
    }
    
    return true;
 }
};
