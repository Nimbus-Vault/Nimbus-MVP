Based on the files provided and our previous discussion, Nimbus Vault is a security research and vulnerability tracking platform. It's built on a sophisticated, hierarchical ontology that helps security professionals methodically break down a target asset's "Attack Surface" by documenting its functionalities, technologies, and behaviours. Its core purpose is to provide a structured workflow for security researchers to document their findings and manage security assessments.

The hierarchical structure of Nimbus Vault breaks down into two complementary models
- **Tracking** 
- **Attack**

both of which power our core suggestion engine. Since Nimbus Vault is built for teams as well as individuals, you can create separate **Workspaces** to keep your personal notes private or share them with collaborators.

# The Tracking model
This handles the tracking of Platforms, Programs & their assets Functionalities, Technologies, Behaviours & Gadgets relevant data associated with them.
There's a separate directory for Bug Bounty Platforms, where the user can create, read, update & delete platforms. within each individual platform, is platform data, such us the name, the url, the popularity & Custom report templates for each platform.

#### Functionalities
Here, the user can create new functionality templates and assign it the following information at creation:
- Functionality Name (eg Password reset)
- Functionality Category (eg Authentication)
- Functionality Description
- Common Endpoints & Parameters (eg /forgot-password)
- Notes
- references
- The user will be able to upload either image files or a mermaid.js scripts of diagrams visualizing the common workflows for that functionality
- Notes
This template will be kept in the functionalities page, where the user can keep adding as many functionalities as needed. When a program assigns a created functionality template to an asset, it makes a copy of the original template so each functionality of an asset can be described individually from others.

#### Technologies
Here, the user can create new technology templates and assign it the following information:
- Technology Name
- Technology Vendor
- Technology Category (eg. javascript framework, Programming Language etc.)
- Documentation URL
- Technology Description
- Latest Version
- Default Configurations
- Default Behaviours
- Notes
This template will be kept in the Technologies page, where the user can keep adding as many Technologies as needed. When a program assigns a created Technology template to an asset, it makes a copy of the original template so each Technology of an asset can be described individually from others.

#### Behaviours
Here, the user can create a new behaviour templates and assign it the following information:
- Behaviour Name
- Behaviour Description (eg Url encodes user input)
- IsGood? (Boolean)
This template will be kept in the Behaviours page, where the user can keep adding as many Behaviours as needed. When a program assigns a created Behaviour template to an asset or its technologies or its functionalities, it makes a copy of the original template so each Behaviour of an asset or its technologies or its functionalities can be described individually from others.


#### Programs
In here, the user can create a new bug bounty program and assign it the following information:
- A name(eg Amazon BBP)
- A platform (eg Hackerone)
- A Description of the program
- the url to the program's page on the platform
- the status of the program (eg Active, Paused, Ended)
- Launch date
- Asset Types (eg mobile app, api, web app, wildcard, IoT device etc)
- Rewards range
- Notes on the program

After the creation of the program, it will be displayed on the programs page. when the user clicks an individual program, it should send them to a separate page. displaying the programs details entered earlier.
It should also display the assets of the programs if there are any. If there aren't, the user should be able to add new assets
the following data will be taken on creation of an asset:
- Asset Name
- Asset type (eg subdomain, mobile app)
- Asset url/link
- Time of Discovery
- Last tested

After the creation of an asset, it should be displayed on the program's page. When the user clicks an asset, that too should lead them to a separate page for that asset.
On this page, the user can assign:
- Functionalities:
	A list of functionalities taken from the functionalities page/vault is shown for the user to select multiple or individually. when the user assigns a functionality to an asset, a copy of the original Functionality template should be made and that is what should be assigned to the asset. The From there, the user would be able to assign a technology to the assigned functionality.
- Technologies:
	A list of Technologies taken from the Technologies page/vault is shown for the user to select multiple or individually. when the user assigns a Technology to an asset, a copy of the original Technology template should be made and that is what should be assigned to the asset.
- Behaviours:
	A list of Behaviours taken from the Behaviours page/vault is shown for the user to select multiple or individually. when the user assigns a Behaviour to an asset, its technology or functionality, a copy of the original Behaviour template should be made and that is what should be assigned to the asset, its technology or functionality

The user will have the ability to write notes about the asset. the Notes feature is the main Focus of an asset and should preferably be written in markdown, as such Nimbus Vault should support Markdown rendering



# The Attack Model
This handles storing all the user's data relating to vulnerabilities. The Attack model follows an ontological model developed by me to trace vulnerability genesis from tech/func through flaws to exploitation.

##### Universal Ontology Of Web Application Vulnerabilities (TB)
![[A Universal Ontology of Web Vulnerabilities.svg]]

##### Universal Ontology Of Web Application Vulnerabilities (LR)
![[A Universal Ontology of Web Vulnerabilities(LR).svg]]

The attack model will be the Knowledge base of all vulnerabilities, Methodologies, techniques, misconfigurations & gadgets. It is essentially a "note-driven" model.
It's divided by the 2 Exploitation Paths:

#### Pattern Driven
A **Pattern‑Driven Exploitation Path** is the multi‑step, structured chain that takes you from a recognized implementation flaw all the way through to a fully realized exploit by following known “patterns” of abuse. Concretely, it unfolds like this:

1. **Vulnerability Class**  
    A vulnerability class is a grouping of individual flaws that share the same underlying root cause or attack surface. Here, the user can create new Vulnerability classes and assign it the following information:
	    - Class Name
	    - Typical Severity Rating (eg Low, Medium, High & Critical)
	    - Description
	    - Required Technologies 
    
2. **Methodology**  
    A methodology is a structured _approach_ for identifying, analysing, or exploiting a class of vulnerabilities. Here the user can type in their general approaches for a specific vulnerability class (In markdown). This will be their knowledge base to store all information about a specific vulnerability class. this page should have full CRUD operations implemented to allow users to create & manipulate as many methodologies as they want
    
3. **Playbooks**
	A playbook is a specific guide for exploiting a specific scenario of a vulnerability class, playbooks can be assigned a technology or functionality. The following data should be assignable:
	- Playbook Name
	- Playbook Description
	- Playbook Content (In markdown)
	- Vulnerability Class
	- The user will be able to upload either image files or a mermaid.js scripts of diagrams visualizing the playbook steps and functionality workflow if any
	- Technologies
	- Functionalities
	- Techniques

4. **Techniques**
	A technique is a low-level step in a testing process. It's a single, atomic action. A technique can be assigned a behaviour, this behaviour is not to describe the technique itself, but to describe the behaviour of an attack vector/functionality/technology of which the technique itself bypasses or takes  advantage of. If bypass is false, then the technique takes advantage of the specified behaviour. The following data should be assignable:
	- Technique Name
	- Technique Tags (eg Probing, Fuzzing)
	- Technique Description
	- Technique Content (In markdown)
	- Technology
	- Functionality
	- Behaviour
	- Bypass? (Boolean)
5. Payloads:
	A payload is the part of a cyberattack that performs the intended malicious action. It is the specific data, code, or command sent to a vulnerable system to achieve a desired outcome. here the user will be able to store lists of payloads for an associated vulnerability class or technique. The following data should be assignable:
	- Payload List Name
	- Associated Technique Name
	- Associated Vulnerability class Name
	- Description
	- Payload Content

In essence, a Pattern‑Driven Exploitation Path is the fully mapped‑out playbook for how to turn a specific class of flaw into a reliable compromise by following industry‑proven patterns at every stage.


#### Non Pattern Driven

Non pattern Exploits can be split into 2:
1. Atomic Vulnerabilities:
	These are mostly One-step, direct abuses associated with specific technologies, The user can add Atomic Exploits and assign the following data:
		- Title
		- Flaw Type (eg.; Misconfiguration)
		- Technology
		- Detection and exploitation steps (in markdown)
		- Chainable (True or false)
		- If chainable is true link chainable vuln
2. Logic Flaws:
	 These are mostly found in poorly designed functionalities, The user can add Logic Exploits and assign the following data:
		- Title
		- Functionalities
		- Technologies
		- The user can upload an image file or a mermaid.js diagram visualizing the common workflows for that functionality that 
		- Detection and exploitation tests (in markdown)
		- Chainable (True or false)
		- If chainable is true ink chainable vuln

# The Suggestion engine

The `Suggestion Engine` is the key feature of Nimbus Vault that separates it from other note taking or pentest tracking tools.
The Suggestion Engine aims to:
**Suggest relevant methodologies, attack vectors, and techniques for exploiting vulnerabilities, based on the identified technologies, functionalities, and behaviours of an asset.**
In essence, the "Suggestion Engine" would leverage the structured relationships in the database to propose potential vulnerabilities, relevant methodologies, specific attack vectors, and detailed techniques based on the technologies, functionalities, and behaviours associated with an asset being assessed.
For example, if an asset is identified as using "Apache Struts" (a `Technology`) and has a "User Login" (`Functionality`), the suggestion engine could look up known `Vulnerability Classes` associated with Apache Struts or login functionalities, then recommend `Methodologies` and `Techniques` (via `Playbooks`) relevant to those vulnerabilities.
# Extras

This document outlines the core architecture and supporting systems for the Nimbus Vault platform. It expands on the data model by defining operational, security, collaboration, and performance considerations.

---

## 1. User & Access Management

**Roles & Permissions**

- **Admin**: Full CRUD on all entities (Platforms, Programs, Assets, Templates, Playbooks).
    
- **Contributor**: Create and edit assigned Assets, Templates, and Playbooks.
    
- **Reader**: View-only access to public and shared data.

**Authentication & Federation**

- Support for SSO (SAML, OAuth2) and API key issuance per user.
    
- Multi-factor authentication (MFA) via TOTP or hardware tokens.

**Audit Logging**

- Record `actor`, `action`, `target resource`, `timestamp`, and `IP address` for all write operations.
    
- Provide an immutable audit trail for compliance and forensic analysis.

---

## 2. Data Relationships & Versioning

**Entity Versioning**

- Each Template, Functionality, Technology, and Behaviour record carries:
    
    - `version`: semantic version string (e.g. `v1.3.0`)
        
    - `createdAt` / `modifiedAt` timestamps
        
    - `modifiedBy` user ID

**Snapshot & Rollback**

- On Template edit, create a new version and snapshot previous state.
    
- UI provides diff views between versions and a one-click rollback.

**Immutable Asset Copies**

- When a Template is applied to an Asset, the Asset stores its own copy of the record to prevent retroactive changes from global Template edits.

---

## 3. Search, Filtering & Tagging

**Full‑Text & Faceted Search**

- Index all descriptive fields (names, descriptions, notes) for fast keyword lookup.
    
- Provide facet filters on Platform, Program, Asset type, Vulnerability class, Technology, and custom tags.
- Custom Query standard for quickly filtering data

**Custom Tagging**

- Allow users to add free‑form `tags` to any entity.
    
- Tag management UI to group, rename, and delete tags across workspace.

**Saved Searches & Views**

- Users can save filter combinations as reusable views (e.g. “Critical Logic Flaws on Mobile Assets”).

---

## 4. Integration & Import/Export

**Data Import**

- Bulk-import via CSV, JSON, TXT or YAML for Platforms, Programs, Assets, Technologies, Templates, and Playbooks.
    
- Mappings file to align external field names to Nimbus Vault schema.

**Data Export**

- Export filtered lists or full workspaces in CSV, JSON, or YAML.
    
- Optionally include version history and audit logs.

**External APIs**

- RESTful API endpoints for read and write operations on all entities.
    
- Webhooks for create/update events (e.g. notify external tracker when a new vulnerability is logged).

**Third‑Party Integrations**

- Native connectors for HackerOne, GitLab, Jira, and Slack.
    
- Scheduled sync of open bounty programs and issue ticket creation.

**Browser Extension Integration**

- **Detection Rules**: Content scripts using CSS selectors and URL patterns to identify page elements corresponding to known functionalities (forms, endpoints, buttons).
    
- **Data Flow**: Page → Content Script → Extension Popup →Nimbus Vault REST API.
    
- **Authentication**: OAuth2 (implicit/grant) or API key flow, with secure token storage and refresh handling.
    
- **Permissions**: Configured in the browser manifest (host permissions, storage, activeTab) to limit scope and protect user privacy.
    
- **Local Cache**: Use browser storage (local or sync) to persist detected items across navigation.
    
- **User Experience**: Popup UI to review, edit, and submit detected functionalities; error handling for network or auth failures; clear feedback on success or retry.


---

## 5. Reporting & Dashboards

**Key Metrics**

- Vulnerability counts by class, platform, and program.
    
- Attack-path coverage per asset.
    
- Testing progress over time (assets assessed vs. pending).

**Dashboard Widgets**

- Interactive charts and tables showing top-10 Findings, Recent Activities, and User Contributions.
    
- Drill-down from summary to underlying records.

**Custom Reports**

- Users can assemble ad-hoc reports by selecting entities, fields, and filters.
    
- Exportable as PDF or CSV with configurable layouts.

---

## 6. Notifications & Collaboration

**Event Subscriptions**

- Users subscribe to one or more event types (e.g. `TemplateCreated`, `PlaybookExecuted`, `AssetUpdated`).
    
- Delivery via in‑app notifications, email digests, or Slack messages.

**Comments & Mentions**

- Comment threads on any record, with `@mentions` to notify specific users.
    
- Threaded discussions retained in audit logs.

**Task Assignment**

- Ability to assign tasks (e.g. “Test this Logic Flaw”) to individuals or teams, with due dates and status tracking.

---

## 7. Security & Compliance

**Data Protection**

- Encryption at rest (AES‑256) and in transit (TLS 1.2+).
    
- Secure storage of secrets (API keys, user credentials) in a secrets manager.

**Input Validation & Hardening**

- Strict schema validation on all API inputs.
    
- Rate‑limiting and IP whitelisting for sensitive endpoints.

**Backup & Disaster Recovery**

- Daily encrypted backups with a 30‑day retention policy.
    
- Periodic DR failover tests to ensure restore capability.

**Compliance Standards**

- SOC 2 Type II readiness checklist.
    
- GDPR controls for data access and erasure upon user request.

---

## 8. Performance & Scalability

**Performance Targets**

- Search queries return within 200 ms for up to 10 K records.
    
- Dashboard load times under 1 s for standard widgets on moderate datasets.

**Scalability**

- Microservices architecture with containerized deployments (Docker/Kubernetes).
    
- Horizontal scaling of API and search services backed by Elasticsearch or equivalent.

**Database Design**

- Use of relational DB (PostgreSQL) with carefully designed indexes on key fields.
    
- Archive stale records to a cold store to keep primary tables performant.

---


## Security Considerations for GraphQL Schema Integrations

1. **Security Considerations**:
    
    - `passwordHash` marked as non-queryable by frontend
        
    - Granular `AccessLevel` enum matches DB constraints

When implementing The backend, ensure that the resolver for `User.passwordHash` is explicitly designed to **never expose the hash** to any GraphQL query. It should be treated as an internal-only field used solely for authentication verification. This is a fundamental security best practice.

---
# UI/UX Design

The Nimbus vault is a modern sleek web application built for hackers/bug bounty hunters, it's default color theme should be dark, but there should also be a light theme option.

### Usable UI:

-  **Notes space**:
	The note space would be used anywhere in the application where the user would have to type some data/notes, like for an asset, playbook, technique etc; It's designed similarly to Obsidian:
		There is a left and right side bar, the left sidebar is distinct from the global side bar. In the middle of both left and right side bars is a space where users can take notes in markdown and save them. the purpose of both the left and right side bars would differ based on where its used.
- **Mini note space**:
	Similar to the note space but without the the left and right side bar by default. whether a side bar would exist would be specified (eg: mini note space with a right side bar)


The should be a global responsive and withdrawable left-side panel. This panel should be divided into 2:

***Tracking***: This would be a collapsible category within the global left-side panel. Within this category would be various tabs for the tracked Items within the tracking model:
	- Dashboard
		To display some quick data from the vault such as: a chart to show the most popular frameworks, recently added playbooks and techniques, total assets, active programs, Quick Actions etc
	- Workspaces
		To display the workspaces available for a user. Full CRUD operations must be allowed here, the user should be able to create, read, update and delete a workspace from this page
	- Platforms
		To display the various platforms created by the user. Just like with workspaces, Full CRUD operations must be allowed here, the user should be able to create, read, update and delete a platform from this page
	- Programs
		To display the various programs created by the user. Full CRUD operations must be allowed here, the user should be able to create, read, update and delete a program from this page. It is also from this page a user can assign assets to a created platform.
			**Assets**:
				An asset is a specific target for a security assessment, it could be a mobile app, domain, IOT device, api etc. When a user assigns an asset to a program, the asset should be displayed on the programs page in an "Assets" category. From here when the user clicks an asset, they should be led to a **Note space**. Here they can enter notes for individual assets. The left side bar of the note space should be divided into 2: **Functionalities** & **Technologies**. The user can assign any functionality & Technology from the functionalities & technologies they've created. The right sidebar would display the **Suggestions** powered by the **Suggestion Engine** to recommend playbooks, techniques, payloads etc; based on the user assigned functionality, technology or behaviour. In the middle space where the user types in notes in markdown, they can create tags for behaviours which the suggestion engine can identify and suggest relevant techniques.
	A divider separates everything above from everything below within the Tracking model, the divider is called **Attack Surface** & within it are the Functionalities, Technologies & Behaviours tabs.
	- Functionalities
		To display the functionalities available for a user. Full CRUD operations must be allowed here, the user should be able to create, read, update and delete a functionality from this page. When the user creates a functionality, it should be displayed on the functionalities page. when a functionality is clicked, they should be led to a **Note space**. The left side bar of the note space should be titled: **Workflows** & the right: **Code Snippets**. On the workflows bar, the user can upload an svg or png image showing a diagram of the various workflows of the specific functionality, or they can type in a mermaid.js script to render the diagram and save it. when a workflow is clicked, a popup window should display the diagram, allowing the user to zoom in & out. On the right, multiple code snippets of common implementations of the specific functionality.
	- Technologies
		To display the technologies available for a user. Full CRUD operations must be allowed here, the user should be able to create, read, update and delete a technology from this page. When the user creates a technology, it should be displayed on the technologies page. when a technology is clicked, they should be led to a **Note space**. The left side bar of the note space should be titled: **Default Configs** & the right: **Default Behaviours**. On the Default Configs bar, the user can type in multiple default configuration notes of the specific technology and save it. when a config is clicked, a popup window should appear, allowing the user to read or edit the config. On the right, multiple Default Behaviours from the created behaviours can be assigned to the technology.
	- Behaviours
		To display the Behaviours available for a user. Full CRUD operations must be allowed here, the user should be able to create, read, update and delete a Behaviour from this page. When the user creates a behaviour, it should be displayed on the behaviours page.

**Attacking**: This would be a collapsible category within the global left-side panel. Within this category would be 2 more collapsible categories Named after the 2 exploitation paths as defined in the Universal Ontology Of Web Application Vulnerabilities (UOWAV) :
		**Pattern Driven**: This would store pattern driven vulnerabilities as the UOWAV defines it
			- Vulnerability Classes
				This is where the user's vulnerability classes are stored, full CRUD operations should be implemented here. the user can create as many vulnerability classes as they need and it will be displayed on this page. When a user clicks a vulnerability class, it should send them to a different page to display full details of the class. in this same page, the various methodologies specific to the clicked vuln class should be displayed in its own section under the title "Methodologies". when a methodology is clicked the user should be sent to a **note space**. The left side bar of the note space should be titled: **Technologies** & the right: **Behaviours**. The user can assign any functionality & Technology from the functionalities & technologies they've created and save it. when a technology is clicked, the user should be sent to the associated technology on in the technologies page . On the right, multiple Behaviours from the created behaviours can be assigned to the methodology, when a behaviour is clicked, the user should be sent to the associated behaviour on in the behaviours page.
			- Playbooks
				This is where the user stores step-by-step instructions for testing a specific scenario of a vulnerability/methodology. full CRUD operations should be implemented here. the user can create as many playbooks as they need and it will be displayed on this page. when a user clicks a playbook, they should be sent to a note space. The left side bar of the note space should be divided into 2: **Functionalities** & **Technologies**. The user can assign any functionality & Technology from the functionalities & technologies they've created. The right sidebar would display the **Behaviours** & **workflows**, the user can assign any behaviour they've created and they can upload an image file visualizing the workflow of the playbook, or paste in a mermaid.js script to render a diagram and save it. when a workflow is clicked, a popup window should display the diagram, allowing the user to zoom in & out. On the right, multiple code snippets of common implementations of the specific functionality.
			- Techniques
				This is where various techniques created by the user will be displayed. Full CRUD operations should be implemented here. the user can create as many Techniques as they need and it will be displayed on this page. when a user clicks a technique, they should be sent to a note space. The left side bar of the note space should be divided into 2: **Functionalities** & **Technologies**. The user can assign any functionality & Technology from the functionalities & technologies they've created. The right sidebar would display the **Behaviours**. The user can assign any behaviour they've created
			- Payloads
				This is where payloads are stored. Full CRUD operations should be implemented here. the user can create as many payloads as they need and it will be displayed on this page. when the user clicks a payload, it should send them to a **mini note space**
		**Non Pattern Driven**: This would store non pattern driven Vulnerabilities as the UOWAV defines it
			- Atomic Vulns
				This is where atomic vulnerabilities are stored. Full CRUD operations should be implemented here. the user should be able to create as many Atomic vulnerabilities as they want. when the user clicks an atomic vuln, they should be sent to a mini note space with a right side bar. the right side bar should be titled technologies, the user can assign any technology created to the atomic vulnerability.


---
# Notes

- Playbook handles functionality specific vulns
- The report generator uses the template of the platform the program/asset can be found on to automatically generate platform standardized reports
- Include the ability to store payloads, especially for injection vulns
- Verify if the database stores the attack models data by their workspace, so data from different workspaces dont conflict

_End of Specification_