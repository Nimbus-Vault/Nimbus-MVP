import fs from 'fs';
import path from 'path';

const pagesDir = 'src/pages';

// Enhanced patterns to identify different types of mock data
const mockPatterns = {
  // Mock variable declarations
  mockArrays: /const\s+(mock\w+)\s*=\s*\[[\s\S]*?\];/g,
  mockObjects: /const\s+(mock\w+)\s*=\s*\{[\s\S]*?\};/g,
  
  // Mock comments
  mockComments: /\/\/\s*Mock data for[\s\S]*?$/gm,
  mockBlockComments: /\/\*[\s\S]*?Mock[\s\S]*?\*\//g,
  
  // Mock operations
  mockOperations: /(mock\w+)\.(push|findIndex|filter|map|find|some|includes)/g,
  mockDirect: /mock\w+(?=[\s\[\.])/g,
  
  // State setters with mock data
  setWithMock: /set\w+\(mock\w+\)/g,
};

// Data adapter mappings
const adapterMappings = {
  'mockPrograms': {
    adapter: 'programAdapter',
    import: "import { programAdapter } from '@/lib/data-adapter';",
    type: 'Program[]',
    methods: {
      getAll: 'programAdapter.getAll()',
      getByWorkspace: 'programAdapter.getByWorkspace(workspaceId)',
      create: 'programAdapter.create(newProgram)',
      update: 'programAdapter.update(id, updates)',
      delete: 'programAdapter.delete(id)'
    }
  },
  'mockAssets': {
    adapter: 'assetAdapter',
    import: "import { assetAdapter } from '@/lib/data-adapter';",
    type: 'Asset[]',
    methods: {
      getAll: 'assetAdapter.getAll()',
      getByProgram: 'assetAdapter.getByProgram(programId)',
      create: 'assetAdapter.create(newAsset)',
      update: 'assetAdapter.update(id, updates)',
      delete: 'assetAdapter.delete(id)'
    }
  },
  'mockPlaybooks': {
    adapter: 'playbookAdapter',
    import: "import { playbookAdapter } from '@/lib/data-adapter';",
    type: 'Playbook[]',
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
    methods: {
      getAll: 'vulnClassAdapter.getAll()',
      create: 'vulnClassAdapter.create(newVulnClass)',
      update: 'vulnClassAdapter.update(id, updates)',
      delete: 'vulnClassAdapter.delete(id)'
    }
  },
  // Add more mappings as needed
  'mockTechniques': {
    adapter: 'techniqueAdapter',
    import: "import { techniqueAdapter } from '@/lib/data-adapter';",
    type: 'Technique[]',
  },
  'mockPayloads': {
    adapter: 'payloadAdapter',
    import: "import { payloadAdapter } from '@/lib/data-adapter';",
    type: 'Payload[]',
  },
  'mockPlatforms': {
    adapter: 'platformAdapter',
    import: "import { platformAdapter } from '@/lib/data-adapter';",
    type: 'Platform[]',
  },
  'mockFunctionalities': {
    adapter: 'functionalityAdapter',
    import: "import { functionalityAdapter } from '@/lib/data-adapter';",
    type: 'Functionality[]',
  },
  'mockTechnologies': {
    adapter: 'technologyAdapter',
    import: "import { technologyAdapter } from '@/lib/data-adapter';",
    type: 'Technology[]',
  },
  'mockBehaviors': {
    adapter: 'behaviorAdapter',
    import: "import { behaviorAdapter } from '@/lib/data-adapter';",
    type: 'Behavior[]',
  },
  'mockAtomicVulns': {
    adapter: 'atomicVulnAdapter',
    import: "import { atomicVulnAdapter } from '@/lib/data-adapter';",
    type: 'AtomicVuln[]',
  },
  'mockLogicFlaws': {
    adapter: 'logicFlawAdapter',
    import: "import { logicFlawAdapter } from '@/lib/data-adapter';",
    type: 'LogicFlaw[]',
  }
};

// Template for adding necessary imports and state
const templateAdditions = {
  imports: `import { useState, useEffect } from 'react';
import { toast } from 'sonner';`,
  stateDeclaration: (entityName, type) => `const [${entityName}, set${entityName.charAt(0).toUpperCase() + entityName.slice(1)}] = useState<${type}>([]);
const [loading, setLoading] = useState(true);`,
  loadFunction: (entityName, adapterCall, setterName) => `
const load${entityName.charAt(0).toUpperCase() + entityName.slice(1)} = async () => {
  try {
    setLoading(true);
    const data = await ${adapterCall};
    ${setterName}(data);
  } catch (error) {
    console.error('Failed to load ${entityName}:', error);
    toast.error('Failed to load ${entityName}');
  } finally {
    setLoading(false);
  }
};`,
  useEffect: (entityName) => `
useEffect(() => {
  load${entityName.charAt(0).toUpperCase() + entityName.slice(1)}();
}, []);`
};

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const analysis = {
    fileName: path.basename(filePath),
    filePath,
    mockVariables: [],
    mockOperations: [],
    mockComments: [],
    totalReferences: 0,
    needsRefactoring: false,
    suggestions: []
  };

  // Find mock variable declarations
  let match;
  mockPatterns.mockArrays.lastIndex = 0;
  while ((match = mockPatterns.mockArrays.exec(content)) !== null) {
    analysis.mockVariables.push({
      name: match[1],
      type: 'array',
      fullMatch: match[0],
      line: content.substring(0, match.index).split('\n').length
    });
    analysis.needsRefactoring = true;
  }

  // Find mock comments
  mockPatterns.mockComments.lastIndex = 0;
  while ((match = mockPatterns.mockComments.exec(content)) !== null) {
    analysis.mockComments.push({
      content: match[0],
      line: content.substring(0, match.index).split('\n').length
    });
  }

  // Find mock operations
  mockPatterns.mockOperations.lastIndex = 0;
  while ((match = mockPatterns.mockOperations.exec(content)) !== null) {
    analysis.mockOperations.push({
      variable: match[1],
      operation: match[2],
      fullMatch: match[0],
      line: content.substring(0, match.index).split('\n').length
    });
    analysis.needsRefactoring = true;
  }

  analysis.totalReferences = analysis.mockVariables.length + 
                           analysis.mockOperations.length + 
                           analysis.mockComments.length;

  // Generate suggestions based on found mock variables
  analysis.mockVariables.forEach(mockVar => {
    if (adapterMappings[mockVar.name]) {
      const mapping = adapterMappings[mockVar.name];
      analysis.suggestions.push({
        type: 'replace_with_adapter',
        mockVariable: mockVar.name,
        adapter: mapping.adapter,
        import: mapping.import,
        dataType: mapping.type
      });
    }
  });

  return analysis;
}

function generateRefactoredCode(analysis, originalContent) {
  if (!analysis.needsRefactoring) {
    return null;
  }

  let newContent = originalContent;
  const addedImports = new Set();
  const addedState = new Set();
  const addedFunctions = new Set();

  // Process each mock variable
  analysis.mockVariables.forEach(mockVar => {
    const mapping = adapterMappings[mockVar.name];
    if (!mapping) return;

    // Remove the mock array declaration
    newContent = newContent.replace(mockVar.fullMatch, '');

    // Add necessary imports
    if (!addedImports.has(mapping.import)) {
      // Check if the import already exists
      if (!newContent.includes(mapping.import.split("'")[1])) {
        // Find import section and add new import
        const importRegex = /import.*from.*['"];/g;
        const imports = newContent.match(importRegex);
        if (imports && imports.length > 0) {
          const lastImport = imports[imports.length - 1];
          newContent = newContent.replace(lastImport, lastImport + '\n' + mapping.import);
        }
      }
      addedImports.add(mapping.import);
    }

    // Add useState and useEffect imports if not present
    if (!newContent.includes("useState") || !newContent.includes("useEffect")) {
      newContent = newContent.replace(
        "import React", 
        "import React, { useState, useEffect }"
      );
    }

    // Add toast import if not present
    if (!newContent.includes("import { toast }") && !newContent.includes("from 'sonner'")) {
      const importRegex = /import.*from.*['"];/g;
      const imports = newContent.match(importRegex);
      if (imports && imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        newContent = newContent.replace(lastImport, lastImport + "\nimport { toast } from 'sonner';");
      }
    }

    // Add state declarations inside the component
    const entityName = mockVar.name.replace('mock', '').toLowerCase();
    const capitalizedEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1);
    
    if (!addedState.has(entityName)) {
      // Find the component function and add state after it
      const componentMatch = newContent.match(/const\s+\w+\s*=\s*\(\)\s*=>\s*{/);
      if (componentMatch) {
        const insertPoint = componentMatch.index + componentMatch[0].length;
        const stateCode = `\n  const [${entityName}, set${capitalizedEntity}] = useState<${mapping.type}>([]);
  const [loading, setLoading] = useState(true);\n`;
        newContent = newContent.slice(0, insertPoint) + stateCode + newContent.slice(insertPoint);
      }
      addedState.add(entityName);
    }

    // Add load function
    if (!addedFunctions.has(entityName) && mapping.methods) {
      const loadFunctionCode = `
  const load${capitalizedEntity} = async () => {
    try {
      setLoading(true);
      const data = await ${mapping.methods.getAll};
      set${capitalizedEntity}(data);
    } catch (error) {
      console.error('Failed to load ${entityName}:', error);
      toast.error('Failed to load ${entityName}');
    } finally {
      setLoading(false);
    }
  };\n`;

      // Find a good place to insert the function (after state declarations)
      const stateRegex = /const \[.*?\] = useState.*?;/g;
      const stateMatches = newContent.match(stateRegex);
      if (stateMatches) {
        const lastStateMatch = stateMatches[stateMatches.length - 1];
        const lastStateIndex = newContent.lastIndexOf(lastStateMatch);
        const insertPoint = lastStateIndex + lastStateMatch.length;
        newContent = newContent.slice(0, insertPoint) + loadFunctionCode + newContent.slice(insertPoint);
      }
      addedFunctions.add(entityName);
    }

    // Add useEffect
    const useEffectCode = `
  useEffect(() => {
    load${capitalizedEntity}();
  }, []);\n`;

    // Insert useEffect after the load function
    const loadFunctionRegex = new RegExp(`const load${capitalizedEntity} = async \\(\\) => {[\\s\\S]*?};`);
    const loadFunctionMatch = newContent.match(loadFunctionRegex);
    if (loadFunctionMatch) {
      const insertPoint = loadFunctionMatch.index + loadFunctionMatch[0].length;
      newContent = newContent.slice(0, insertPoint) + useEffectCode + newContent.slice(insertPoint);
    }

    // Replace mock variable references with the new state variable
    const mockVarRegex = new RegExp(`\\b${mockVar.name}\\b`, 'g');
    newContent = newContent.replace(mockVarRegex, entityName);
  });

  // Remove mock comments
  analysis.mockComments.forEach(comment => {
    newContent = newContent.replace(comment.content, '');
  });

  // Clean up empty lines
  newContent = newContent.replace(/\n\s*\n\s*\n/g, '\n\n');

  return newContent;
}

function processFile(filePath, dryRun = true) {
  console.log(`\n🔄 Processing ${path.basename(filePath)}...`);
  
  const analysis = analyzeFile(filePath);
  
  if (!analysis.needsRefactoring) {
    console.log('   ✅ No mock data found, skipping');
    return { success: true, changes: 0 };
  }

  console.log(`   📊 Found ${analysis.totalReferences} mock references:`);
  console.log(`      - ${analysis.mockVariables.length} mock variables`);
  console.log(`      - ${analysis.mockOperations.length} mock operations`);
  console.log(`      - ${analysis.mockComments.length} mock comments`);

  // Show suggested changes
  if (analysis.suggestions.length > 0) {
    console.log('   🔧 Suggested changes:');
    analysis.suggestions.forEach(suggestion => {
      console.log(`      - Replace ${suggestion.mockVariable} with ${suggestion.adapter}`);
    });
  }

  if (!dryRun) {
    try {
      const originalContent = fs.readFileSync(filePath, 'utf-8');
      const newContent = generateRefactoredCode(analysis, originalContent);
      
      if (newContent && newContent !== originalContent) {
        // Create backup
        const backupPath = filePath + '.backup';
        fs.writeFileSync(backupPath, originalContent, 'utf-8');
        console.log(`   💾 Backup created: ${path.basename(backupPath)}`);
        
        // Write refactored content
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log('   ✅ File updated successfully');
        
        return { success: true, changes: analysis.totalReferences };
      } else {
        console.log('   ⚠️  No changes needed');
        return { success: true, changes: 0 };
      }
    } catch (error) {
      console.error(`   ❌ Error processing file: ${error.message}`);
      return { success: false, changes: 0, error: error.message };
    }
  }

  return { success: true, changes: analysis.totalReferences, dryRun: true };
}

function scanAllFiles() {
  console.log('🔍 Scanning all pages for mock data...\n');
  
  const files = fs.readdirSync(pagesDir)
    .filter(file => file.endsWith('.tsx'))
    .map(file => path.join(pagesDir, file));

  const results = files.map(filePath => {
    const analysis = analyzeFile(filePath);
    return {
      file: path.basename(filePath),
      ...analysis
    };
  }).filter(result => result.needsRefactoring);

  // Sort by number of references (highest first)
  results.sort((a, b) => b.totalReferences - a.totalReferences);

  console.log(`📊 Summary: Found mock data in ${results.length} files\n`);
  
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.file}: ${result.totalReferences} references`);
    if (result.suggestions.length > 0) {
      result.suggestions.forEach(suggestion => {
        console.log(`   → ${suggestion.mockVariable} → ${suggestion.adapter}`);
      });
    }
  });

  return results;
}

function processAllFiles(dryRun = true) {
  const files = fs.readdirSync(pagesDir)
    .filter(file => file.endsWith('.tsx'))
    .map(file => path.join(pagesDir, file));

  console.log(`${dryRun ? '🔍 DRY RUN:' : '🚀 PROCESSING:'} Mock data removal`);
  console.log(`Found ${files.length} TypeScript React files\n`);

  const results = {
    processed: 0,
    updated: 0,
    errors: 0,
    totalChanges: 0
  };

  files.forEach(filePath => {
    const result = processFile(filePath, dryRun);
    results.processed++;
    
    if (result.success) {
      if (result.changes > 0) {
        results.updated++;
        results.totalChanges += result.changes;
      }
    } else {
      results.errors++;
    }
  });

  console.log('\n📈 SUMMARY:');
  console.log(`   📁 Files processed: ${results.processed}`);
  console.log(`   ✅ Files updated: ${results.updated}`);
  console.log(`   🔄 Total changes: ${results.totalChanges}`);
  console.log(`   ❌ Errors: ${results.errors}`);

  if (dryRun) {
    console.log('\n💡 This was a dry run. Add --apply to actually make changes.');
    console.log('💡 Run with --scan to see detailed analysis of each file.');
  }

  return results;
}

// Command line interface
const args = process.argv.slice(2);
const isDryRun = !args.includes('--apply');
const isScanning = args.includes('--scan');

console.log('🎯 Mock Data Removal Tool');
console.log('================================\n');

if (isScanning) {
  scanAllFiles();
} else {
  processAllFiles(isDryRun);
}

// Clean up temp file when done
process.on('exit', () => {
  try {
    if (fs.existsSync('test-supabase-connection.js')) {
      // Keep the test file for reference
    }
  } catch (e) {
    // Ignore cleanup errors
  }
});
