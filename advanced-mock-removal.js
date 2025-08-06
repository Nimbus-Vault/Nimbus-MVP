import fs from 'fs';
import path from 'path';

const pagesDir = 'src/pages';

// Mock data detection patterns
const mockPatterns = {
  // Mock variable declarations (including multi-line arrays)
  mockArrayDeclarations: /const\s+(mock\w+)\s*=\s*\[[\s\S]*?\];/g,
  mockObjectDeclarations: /const\s+(mock\w+)\s*=\s*\{[\s\S]*?\};/g,
  
  // Mock operations and references
  mockOperations: /(mock\w+)\.(push|findIndex|filter|map|find|some|includes|splice|length)/g,
  mockDirectReferences: /\bmock\w+\b/g,
  
  // Comments about mock data
  mockComments: /\/\/\s*Mock data[^\n]*/g,
  mockBlockComments: /\/\*[\s\S]*?Mock[\s\S]*?\*\//g,
};

// Data adapter mappings with improved type information
const adapterMappings = {
  'mockPrograms': {
    adapter: 'programAdapter',
    import: "import { programAdapter } from '@/lib/data-adapter';",
    type: 'Program[]',
    entityName: 'programs',
    methods: {
      getAll: 'programAdapter.getAll()',
      create: 'programAdapter.create(newProgram)',
      update: 'programAdapter.update(id, updates)',
      delete: 'programAdapter.delete(id)'
    }
  },
  'mockAssets': {
    adapter: 'assetAdapter',
    import: "import { assetAdapter } from '@/lib/data-adapter';",
    type: 'Asset[]',
    entityName: 'assets',
    methods: {
      getAll: 'assetAdapter.getAll()',
      create: 'assetAdapter.create(newAsset)',
      update: 'assetAdapter.update(id, updates)',
      delete: 'assetAdapter.delete(id)'
    }
  },
  'mockPlaybooks': {
    adapter: 'playbookAdapter',
    import: "import { playbookAdapter } from '@/lib/data-adapter';",
    type: 'Playbook[]',
    entityName: 'playbooks',
    methods: {
      getAll: 'playbookAdapter.getAll()',
      create: 'playbookAdapter.create(newPlaybook)',
      update: 'playbookAdapter.update(id, updates)',
      delete: 'playbookAdapter.delete(id)'
    }
  },
  'mockMethodologies': {
    adapter: 'methodologyAdapter',
    import: "import { methodologyAdapter } from '@/lib/data-adapter';",
    type: 'Methodology[]',
    entityName: 'methodologies',
    methods: {
      getAll: 'methodologyAdapter.getAll()',
      create: 'methodologyAdapter.create(newMethodology)',
      update: 'methodologyAdapter.update(id, updates)',
      delete: 'methodologyAdapter.delete(id)'
    }
  },
  'mockVulnClasses': {
    adapter: 'vulnClassAdapter',
    import: "import { vulnClassAdapter } from '@/lib/data-adapter';",
    type: 'VulnClass[]',
    entityName: 'vulnClasses',
    methods: {
      getAll: 'vulnClassAdapter.getAll()',
      create: 'vulnClassAdapter.create(newVulnClass)',
      update: 'vulnClassAdapter.update(id, updates)',
      delete: 'vulnClassAdapter.delete(id)'
    }
  },
  'mockTechniques': {
    adapter: 'techniqueAdapter',
    import: "import { techniqueAdapter } from '@/lib/data-adapter';",
    type: 'any[]', // TODO: Add proper Technique type
    entityName: 'techniques',
    methods: {
      getAll: 'techniqueAdapter.getAll()',
      create: 'techniqueAdapter.create(newTechnique)',
      update: 'techniqueAdapter.update(id, updates)',
      delete: 'techniqueAdapter.delete(id)'
    }
  },
  'mockPayloads': {
    adapter: 'payloadAdapter',
    import: "import { payloadAdapter } from '@/lib/data-adapter';",
    type: 'any[]', // TODO: Add proper Payload type
    entityName: 'payloads',
    methods: {
      getAll: 'payloadAdapter.getAll()',
      create: 'payloadAdapter.create(newPayload)',
      update: 'payloadAdapter.update(id, updates)',
      delete: 'payloadAdapter.delete(id)'
    }
  },
  'mockPlatforms': {
    adapter: 'platformAdapter',
    import: "import { platformAdapter } from '@/lib/data-adapter';",
    type: 'any[]', // TODO: Add proper Platform type
    entityName: 'platforms',
    methods: {
      getAll: 'platformAdapter.getAll()',
      create: 'platformAdapter.create(newPlatform)',
      update: 'platformAdapter.update(id, updates)',
      delete: 'platformAdapter.delete(id)'
    }
  },
  'mockFunctionalities': {
    adapter: 'functionalityAdapter',
    import: "import { functionalityAdapter } from '@/lib/data-adapter';",
    type: 'any[]', // TODO: Add proper Functionality type
    entityName: 'functionalities',
    methods: {
      getAll: 'functionalityAdapter.getAll()',
      create: 'functionalityAdapter.create(newFunctionality)',
      update: 'functionalityAdapter.update(id, updates)',
      delete: 'functionalityAdapter.delete(id)'
    }
  },
  'mockTechnologies': {
    adapter: 'technologyAdapter',
    import: "import { technologyAdapter } from '@/lib/data-adapter';",
    type: 'any[]', // TODO: Add proper Technology type
    entityName: 'technologies',
    methods: {
      getAll: 'technologyAdapter.getAll()',
      create: 'technologyAdapter.create(newTechnology)',
      update: 'technologyAdapter.update(id, updates)',
      delete: 'technologyAdapter.delete(id)'
    }
  },
  'mockBehaviors': {
    adapter: 'behaviorAdapter',
    import: "import { behaviorAdapter } from '@/lib/data-adapter';",
    type: 'any[]', // TODO: Add proper Behavior type
    entityName: 'behaviors',
    methods: {
      getAll: 'behaviorAdapter.getAll()',
      create: 'behaviorAdapter.create(newBehavior)',
      update: 'behaviorAdapter.update(id, updates)',
      delete: 'behaviorAdapter.delete(id)'
    }
  },
  'mockAtomicVulns': {
    adapter: 'atomicVulnAdapter',
    import: "import { atomicVulnAdapter } from '@/lib/data-adapter';",
    type: 'any[]', // TODO: Add proper AtomicVuln type
    entityName: 'atomicVulns',
    methods: {
      getAll: 'atomicVulnAdapter.getAll()',
      create: 'atomicVulnAdapter.create(newAtomicVuln)',
      update: 'atomicVulnAdapter.update(id, updates)',
      delete: 'atomicVulnAdapter.delete(id)'
    }
  },
  'mockLogicFlaws': {
    adapter: 'logicFlawAdapter',
    import: "import { logicFlawAdapter } from '@/lib/data-adapter';",
    type: 'any[]', // TODO: Add proper LogicFlaw type
    entityName: 'logicFlaws',
    methods: {
      getAll: 'logicFlawAdapter.getAll()',
      create: 'logicFlawAdapter.create(newLogicFlaw)',
      update: 'logicFlawAdapter.update(id, updates)',
      delete: 'logicFlawAdapter.delete(id)'
    }
  }
};

// Templates for code generation
const codeTemplates = {
  stateDeclaration: (entityName, type) => 
    `  const [${entityName}, set${entityName.charAt(0).toUpperCase() + entityName.slice(1)}] = useState<${type}>([]);\n  const [loading, setLoading] = useState(true);`,
  
  loadFunction: (entityName, adapterCall) => {
    const capitalized = entityName.charAt(0).toUpperCase() + entityName.slice(1);
    const setter = `set${capitalized}`;
    return `\n  const load${capitalized} = async () => {\n    try {\n      setLoading(true);\n      const data = await ${adapterCall};\n      ${setter}(data);\n    } catch (error) {\n      console.error('Failed to load ${entityName}:', error);\n      toast.error('Failed to load ${entityName}');\n    } finally {\n      setLoading(false);\n    }\n  };`;
  },

  useEffect: (entityName) => {
    const capitalized = entityName.charAt(0).toUpperCase() + entityName.slice(1);
    return `\n  useEffect(() => {\n    load${capitalized}();\n  }, []);`;
  },

  createFunction: (entityName, adapterCall) => {
    const capitalized = entityName.charAt(0).toUpperCase() + entityName.slice(1);
    return `\n  const handleCreate${capitalized.slice(0, -1)} = async () => {\n    try {\n      await ${adapterCall};\n      toast.success('Created successfully');\n      load${capitalized}();\n      // Reset form state here\n    } catch (error) {\n      console.error('Failed to create:', error);\n      toast.error('Failed to create');\n    }\n  };`;
  },

  updateFunction: (entityName, adapterCall) => {
    const capitalized = entityName.charAt(0).toUpperCase() + entityName.slice(1);
    return `\n  const handleUpdate${capitalized.slice(0, -1)} = async () => {\n    try {\n      await ${adapterCall};\n      toast.success('Updated successfully');\n      load${capitalized}();\n      // Reset edit state here\n    } catch (error) {\n      console.error('Failed to update:', error);\n      toast.error('Failed to update');\n    }\n  };`;
  },

  deleteFunction: (entityName, adapterCall) => {
    const capitalized = entityName.charAt(0).toUpperCase() + entityName.slice(1);
    return `\n  const handleDelete${capitalized.slice(0, -1)} = async (id: string) => {\n    if (window.confirm('Are you sure you want to delete this item?')) {\n      try {\n        await ${adapterCall};\n        toast.success('Deleted successfully');\n        load${capitalized}();\n      } catch (error) {\n        console.error('Failed to delete:', error);\n        toast.error('Failed to delete');\n      }\n    }\n  };`;
  }
};

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  
  const analysis = {
    fileName,
    filePath,
    content,
    mockDeclarations: [],
    mockReferences: [],
    mockComments: [],
    totalIssues: 0,
    needsRefactoring: false,
    suggestedChanges: []
  };

  // Find mock declarations
  let match;
  mockPatterns.mockArrayDeclarations.lastIndex = 0;
  while ((match = mockPatterns.mockArrayDeclarations.exec(content)) !== null) {
    analysis.mockDeclarations.push({
      name: match[1],
      fullMatch: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      line: content.substring(0, match.index).split('\n').length
    });
    analysis.needsRefactoring = true;
  }

  // Find mock references/operations
  mockPatterns.mockOperations.lastIndex = 0;
  while ((match = mockPatterns.mockOperations.exec(content)) !== null) {
    analysis.mockReferences.push({
      mockName: match[1],
      operation: match[2],
      fullMatch: match[0],
      startIndex: match.index,
      line: content.substring(0, match.index).split('\n').length
    });
    analysis.needsRefactoring = true;
  }

  // Find mock comments
  mockPatterns.mockComments.lastIndex = 0;
  while ((match = mockPatterns.mockComments.exec(content)) !== null) {
    analysis.mockComments.push({
      content: match[0],
      startIndex: match.index,
      line: content.substring(0, match.index).split('\n').length
    });
  }

  analysis.totalIssues = analysis.mockDeclarations.length + 
                        analysis.mockReferences.length + 
                        analysis.mockComments.length;

  // Generate suggestions
  const foundMocks = new Set();
  analysis.mockDeclarations.forEach(decl => {
    foundMocks.add(decl.name);
  });
  analysis.mockReferences.forEach(ref => {
    foundMocks.add(ref.mockName);
  });

  foundMocks.forEach(mockName => {
    if (adapterMappings[mockName]) {
      const mapping = adapterMappings[mockName];
      analysis.suggestedChanges.push({
        type: 'replace_with_adapter',
        mockName,
        adapter: mapping.adapter,
        entityName: mapping.entityName,
        import: mapping.import,
        dataType: mapping.type
      });
    }
  });

  return analysis;
}

function generateRefactoredCode(analysis) {
  if (!analysis.needsRefactoring) {
    return null;
  }

  let newContent = analysis.content;
  const processedMocks = new Set();
  const requiredImports = new Set();
  const addedComponents = new Set();

  // Process each suggestion
  analysis.suggestedChanges.forEach(suggestion => {
    if (processedMocks.has(suggestion.mockName)) return;
    
    const mapping = adapterMappings[suggestion.mockName];
    if (!mapping) return;

    // Add required imports
    requiredImports.add(mapping.import);
    requiredImports.add("import { useState, useEffect } from 'react';");
    requiredImports.add("import { toast } from 'sonner';");

    processedMocks.add(suggestion.mockName);
  });

  // Remove mock array declarations
  analysis.mockDeclarations.forEach(decl => {
    if (adapterMappings[decl.name]) {
      newContent = newContent.replace(decl.fullMatch, '');
    }
  });

  // Remove mock comments
  analysis.mockComments.forEach(comment => {
    newContent = newContent.replace(comment.content, '');
  });

  // Replace mock variable references with actual state variables
  analysis.suggestedChanges.forEach(suggestion => {
    const mockRegex = new RegExp(`\\b${suggestion.mockName}\\b`, 'g');
    newContent = newContent.replace(mockRegex, suggestion.entityName);
  });

  // Add necessary imports
  const existingImports = newContent.match(/^import.*$/gm) || [];
  const lastImportIndex = existingImports.length > 0 ? 
    newContent.lastIndexOf(existingImports[existingImports.length - 1]) + 
    existingImports[existingImports.length - 1].length : 0;

  let importsToAdd = [];
  requiredImports.forEach(importStatement => {
    const importPath = importStatement.match(/from ['"]([^'"]+)['"]/)?.[1];
    const hasExistingImport = existingImports.some(existingImport => 
      existingImport.includes(importPath));
    
    if (!hasExistingImport) {
      importsToAdd.push(importStatement);
    }
  });

  if (importsToAdd.length > 0) {
    const newImports = '\n' + importsToAdd.join('\n') + '\n';
    newContent = newContent.slice(0, lastImportIndex) + newImports + newContent.slice(lastImportIndex);
  }

  // Add state declarations and functions inside the component
  const componentMatch = newContent.match(/(export default function \w+\(\)|function \w+\(\)|const \w+ = \(\) =>) \{/);
  if (componentMatch && analysis.suggestedChanges.length > 0) {
    const insertPoint = componentMatch.index + componentMatch[0].length;
    
    let codeToInsert = '';
    
    // Add state declarations
    analysis.suggestedChanges.forEach(suggestion => {
      if (addedComponents.has(suggestion.entityName)) return;
      
      const stateCode = '\n  ' + codeTemplates.stateDeclaration(suggestion.entityName, suggestion.dataType);
      codeToInsert += stateCode + '\n';
      
      const mapping = adapterMappings[suggestion.mockName];
      if (mapping && mapping.methods) {
        // Add load function
        const loadCode = codeTemplates.loadFunction(suggestion.entityName, mapping.methods.getAll);
        codeToInsert += loadCode + '\n';
        
        // Add useEffect
        const useEffectCode = codeTemplates.useEffect(suggestion.entityName);
        codeToInsert += useEffectCode + '\n';
        
        // Add CRUD functions if the original had them
        if (analysis.content.includes('handleCreate') || analysis.content.includes('.push(')) {
          codeToInsert += codeTemplates.createFunction(suggestion.entityName, mapping.methods.create) + '\n';
        }
        
        if (analysis.content.includes('handleUpdate') || analysis.content.includes('findIndex')) {
          codeToInsert += codeTemplates.updateFunction(suggestion.entityName, mapping.methods.update) + '\n';
        }
        
        if (analysis.content.includes('handleDelete') || analysis.content.includes('.splice(')) {
          codeToInsert += codeTemplates.deleteFunction(suggestion.entityName, mapping.methods.delete) + '\n';
        }
      }
      
      addedComponents.add(suggestion.entityName);
    });
    
    newContent = newContent.slice(0, insertPoint) + codeToInsert + newContent.slice(insertPoint);
  }

  // Clean up extra whitespace
  newContent = newContent.replace(/\n\s*\n\s*\n/g, '\n\n');
  newContent = newContent.replace(/^import.*\n\n+/gm, (match) => match.replace(/\n\n+/, '\n'));

  return newContent;
}

function processFile(filePath, dryRun = true) {
  console.log(`\n🔄 Processing ${path.basename(filePath)}...`);
  
  const analysis = analyzeFile(filePath);
  
  if (!analysis.needsRefactoring) {
    console.log('   ✅ No mock data found');
    return { success: true, changes: 0 };
  }

  console.log(`   📊 Found ${analysis.totalIssues} mock references:`);
  console.log(`      - ${analysis.mockDeclarations.length} mock declarations`);
  console.log(`      - ${analysis.mockReferences.length} mock operations`);
  console.log(`      - ${analysis.mockComments.length} mock comments`);

  if (analysis.suggestedChanges.length > 0) {
    console.log('   🔧 Suggested changes:');
    analysis.suggestedChanges.forEach(change => {
      console.log(`      - Replace ${change.mockName} with ${change.adapter} → ${change.entityName}`);
    });
  }

  if (!dryRun) {
    try {
      const newContent = generateRefactoredCode(analysis);
      
      if (newContent && newContent !== analysis.content) {
        // Create backup
        const backupPath = filePath + '.backup';
        fs.writeFileSync(backupPath, analysis.content, 'utf-8');
        console.log(`   💾 Backup created: ${path.basename(backupPath)}`);
        
        // Write new content
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log('   ✅ File refactored successfully');
        
        return { success: true, changes: analysis.totalIssues };
      } else {
        console.log('   ⚠️  No changes made');
        return { success: true, changes: 0 };
      }
    } catch (error) {
      console.error(`   ❌ Error processing file: ${error.message}`);
      return { success: false, changes: 0, error: error.message };
    }
  }

  return { success: true, changes: analysis.totalIssues, dryRun: true };
}

function processAllFiles(dryRun = true) {
  const files = fs.readdirSync(pagesDir)
    .filter(file => file.endsWith('.tsx'))
    .map(file => path.join(pagesDir, file));

  console.log(`🚀 ${dryRun ? 'DRY RUN:' : 'PROCESSING:'} Advanced Mock Data Removal`);
  console.log(`Found ${files.length} React TypeScript files to analyze\n`);

  const results = {
    processed: 0,
    updated: 0,
    errors: 0,
    totalChanges: 0,
    skipped: 0
  };

  files.forEach(filePath => {
    const result = processFile(filePath, dryRun);
    results.processed++;
    
    if (result.success) {
      if (result.changes > 0) {
        results.updated++;
        results.totalChanges += result.changes;
      } else {
        results.skipped++;
      }
    } else {
      results.errors++;
      console.error(`   Error in ${path.basename(filePath)}: ${result.error}`);
    }
  });

  console.log('\n📈 FINAL SUMMARY:');
  console.log(`   📁 Files processed: ${results.processed}`);
  console.log(`   ✅ Files updated: ${results.updated}`);
  console.log(`   ⏭️  Files skipped: ${results.skipped}`);
  console.log(`   🔄 Total changes: ${results.totalChanges}`);
  console.log(`   ❌ Errors: ${results.errors}`);

  if (dryRun) {
    console.log('\n💡 This was a dry run. Use --apply to execute changes.');
    console.log('💡 Backups will be created for all modified files.');
    console.log('💡 You may need to manually adjust some import paths and function calls.');
  } else {
    console.log('\n✅ Mock data removal complete!');
    console.log('🔍 Please review the changes and test your application.');
    console.log('📝 You may need to add proper TypeScript types for the new adapters.');
  }

  return results;
}

// Command line interface
const args = process.argv.slice(2);
const isDryRun = !args.includes('--apply');

console.log('🎯 Advanced Mock Data Removal Tool');
console.log('==================================\n');

processAllFiles(isDryRun);
