-----------------------------
-- Extension for UUIDs
-----------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-----------------------------
-- Core Identity & Access Management
-----------------------------
CREATE TYPE program_status_enum AS ENUM ('Active', 'Paused', 'Ended');
CREATE TYPE vuln_class_severity_enum AS ENUM ('Low', 'Medium', 'High', 'Critical');

CREATE TABLE "user" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE role (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE user_role (
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES role(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-----------------------------
-- Workspace Foundation
-----------------------------
CREATE TABLE workspace (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_public BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE workspace_member (
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES role(id) ON DELETE CASCADE,
  PRIMARY KEY (workspace_id, user_id)
);

CREATE TABLE workspace_share (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  shared_with UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  access_level VARCHAR(20) NOT NULL CHECK (access_level IN ('view','edit','admin')),
  shared_by UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  shared_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

-----------------------------
-- Audit & Logging
-----------------------------
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspace(id) ON DELETE SET NULL,
  actor_user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  resource_id UUID NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45) NOT NULL
);

-----------------------------
-- Program Management
-----------------------------
CREATE TABLE platform (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  platform_url VARCHAR(500),
  description TEXT,
  logo_url VARCHAR(500),
  popularity_rank INT,
  report_template TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scope_type (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE program (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  platform_id UUID NOT NULL REFERENCES platform(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  program_url VARCHAR(500),
  status program_status_enum NOT NULL DEFAULT 'Active',
  launch_date DATE,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE program_scope_type (
  program_id UUID NOT NULL REFERENCES program(id) ON DELETE CASCADE,
  scope_type_id UUID NOT NULL REFERENCES scope_type(id) ON DELETE CASCADE,
  PRIMARY KEY (program_id, scope_type_id)
);

CREATE TABLE bounty_tier (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES program(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency_code CHAR(3) NOT NULL,
  reward_type VARCHAR(50)
);

-----------------------------
-- Asset Tracking
-----------------------------
CREATE TABLE asset (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES program(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  asset_type VARCHAR(50) NOT NULL,
  asset_url VARCHAR(500),
  discovered_at TIMESTAMP,
  last_tested_at TIMESTAMP,
  notes_md TEXT,
  context_tags JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-----------------------------
-- Knowledge Base Templates
-----------------------------
CREATE TABLE technology_template (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  version VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  vendor VARCHAR(255),
  category VARCHAR(100),
  doc_url VARCHAR(500),
  description TEXT,
  created_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE functionality_template (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  version VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  common_endpoints TEXT,
  notes TEXT,
  diagram_md TEXT,
  common_vectors TEXT,
  created_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE behaviour_template (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  version VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  context_tags JSONB,
  created_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-----------------------------
-- Asset-Component Relationships
-----------------------------
CREATE TABLE asset_functionality (
  instance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES asset(id) ON DELETE CASCADE,
  func_tmpl_id UUID NOT NULL REFERENCES functionality_template(id) ON DELETE CASCADE,
  snapshot JSONB,
  context_tags JSONB,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE asset_technology (
  instance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES asset(id) ON DELETE CASCADE,
  tech_tmpl_id UUID NOT NULL REFERENCES technology_template(id) ON DELETE CASCADE,
  snapshot JSONB,
  context_tags JSONB,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE asset_behaviour (
  instance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES asset(id) ON DELETE CASCADE,
  behav_tmpl_id UUID NOT NULL REFERENCES behaviour_template(id) ON DELETE CASCADE,
  snapshot JSONB,
  context_tags JSONB,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-----------------------------
-- Vulnerability Knowledge
-----------------------------
CREATE TABLE vuln_class (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  severity vuln_class_severity_enum NOT NULL,
  description TEXT,
  created_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-----------------------------
-- Methodology Layer
-----------------------------
CREATE TABLE methodology_category (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  name VARCHAR(100) UNIQUE NOT NULL,
  descr TEXT
);

CREATE TABLE methodology (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  vuln_class_id UUID NOT NULL REFERENCES vuln_class(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES methodology_category(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE methodology_revision (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  methodology_id UUID NOT NULL REFERENCES methodology(id) ON DELETE CASCADE,
  version VARCHAR(20) NOT NULL,
  changes_md TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-----------------------------
-- Playbook Layer
-----------------------------
CREATE TABLE playbook (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  methodology_id UUID NOT NULL REFERENCES methodology(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  content_md TEXT,
  diagram_md TEXT,
  context_tags JSONB,
  created_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE playbook_technology (
  playbook_id UUID NOT NULL REFERENCES playbook(id) ON DELETE CASCADE,
  tech_tmpl_id UUID NOT NULL REFERENCES technology_template(id) ON DELETE CASCADE,
  PRIMARY KEY (playbook_id, tech_tmpl_id)
);

CREATE TABLE playbook_functionality (
  playbook_id UUID NOT NULL REFERENCES playbook(id) ON DELETE CASCADE,
  func_tmpl_id UUID NOT NULL REFERENCES functionality_template(id) ON DELETE CASCADE,
  PRIMARY KEY (playbook_id, func_tmpl_id)
);

-----------------------------
-- Technique Layer
-----------------------------
CREATE TABLE technique (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  entry_point VARCHAR(100),
  tags JSONB,
  description TEXT,
  created_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE playbook_technique (
  playbook_id UUID NOT NULL REFERENCES playbook(id) ON DELETE CASCADE,
  technique_id UUID NOT NULL REFERENCES technique(id) ON DELETE CASCADE,
  PRIMARY KEY (playbook_id, technique_id)
);

CREATE TABLE technique_functionality (
  technique_id UUID NOT NULL REFERENCES technique(id) ON DELETE CASCADE,
  func_tmpl_id UUID NOT NULL REFERENCES functionality_template(id) ON DELETE CASCADE,
  PRIMARY KEY (technique_id, func_tmpl_id)
);

-----------------------------
-- Payload Layer
-----------------------------
CREATE TABLE payload (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  technique_id UUID NOT NULL REFERENCES technique(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  context_tags JSONB,
  efficacy_score INT CHECK (efficacy_score BETWEEN 0 AND 100),
  created_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-----------------------------
-- Vulnerability Types
-----------------------------
CREATE TABLE atomic_vuln (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  flaw_type VARCHAR(100),
  technology VARCHAR(255),
  steps_md TEXT,
  chainable BOOLEAN NOT NULL DEFAULT false,
  chain_to_id UUID REFERENCES atomic_vuln(id) ON DELETE SET NULL,
  created_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE logic_flaw (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  steps_md TEXT,
  chainable BOOLEAN NOT NULL DEFAULT false,
  chain_to_id UUID REFERENCES logic_flaw(id) ON DELETE SET NULL,
  created_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-----------------------------
-- Gadgets & Automation
-----------------------------
CREATE TABLE gadget (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gadget_playbook (
  gadget_id UUID NOT NULL REFERENCES gadget(id) ON DELETE CASCADE,
  playbook_id UUID NOT NULL REFERENCES playbook(id) ON DELETE CASCADE,
  PRIMARY KEY (gadget_id, playbook_id)
);

-----------------------------
-- Tagging System
-----------------------------
CREATE TABLE tag (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE entity_tag (
  tag_id UUID NOT NULL REFERENCES tag(id) ON DELETE CASCADE,
  entity VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  PRIMARY KEY (tag_id, entity, entity_id)
);