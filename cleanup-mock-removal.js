import fs from 'fs';
import path from 'path';

const pagesDir = 'src/pages';

// Patterns to clean up after the mock removal
const cleanupPatterns = {
  // Remove old mock-based CRUD function implementations
  oldCrudFunctions: {
    create: /const handle\w+\s*=\s*\(\)\s*=>\s*\{[\s\S]*?console\.log\(.*?\);[\s\S]*?\.push\([\s\S]*?\);[\s\S]*?\};/g,
    update: /const handle\w+\s*=\s*\(\)\s*=>\s*\{[\s\S]*?console\.log\(.*?\);[\s\S]*?const index = .*\.findIndex[\s\S]*?\[index\] = [\s\S]*?\};/g,
    delete: /const handle\w+\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?console\.log\(.*?\);[\s\S]*?\.splice\([\s\S]*?\};/g
  },
  
  // Add missing imports
  missingUseEffect: /import { useState, useEffect }/,
  missingToast: /import.*toast.*from 'sonner'/,
  
  // Duplicate function declarations
  duplicateFunctions: /const (handle\w+)\s*=.*?\{[\s\S]*?\};\s*const \1\s*=/g
};

function cleanupFile(filePath) {
  console.log(`🧹 Cleaning up ${path.basename(filePath)}...`);
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let changes = 0;
  
  // Add missing useEffect import if useState is imported but useEffect is not
  if (content.includes('useState') && content.includes('useEffect(') && !content.includes('useEffect') && !content.includes('import { useState, useEffect }')) {
    content = content.replace(
      /import \{ useState \}/,
      'import { useState, useEffect }'
    );
    changes++;
    console.log('   ✅ Added useEffect to import');
  }

  // Fix duplicate function names by removing old implementations
  const duplicateFunctionMatches = [...content.matchAll(/const (handle\w+)\s*=[\s\S]*?\{[\s\S]*?\};\s*(?=const \1)/g)];
  
  for (const match of duplicateFunctionMatches) {
    const oldImplementation = match[0];
    // Only remove if it contains mock-style operations (console.log, push, splice, findIndex with manual array manipulation)
    if (oldImplementation.includes('console.log') && 
        (oldImplementation.includes('.push(') || 
         oldImplementation.includes('.splice(') || 
         oldImplementation.includes('[index] ='))) {
      content = content.replace(oldImplementation, '');
      changes++;
      console.log(`   ✅ Removed duplicate function: ${match[1]}`);
    }
  }

  // Remove standalone console.log statements from old CRUD operations
  const consoleLogPattern = /console\.log\([^)]*\);\s*\/\/.*implementation.*\n/g;
  content = content.replace(consoleLogPattern, '');
  
  // Clean up empty lines
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Add missing Asset type import if needed
  if (content.includes('useState<Asset[]>') && !content.includes('import') && !content.includes('Asset')) {
    // Find the import section and add type import
    const lastImportMatch = content.match(/import.*from.*['"];/g);
    if (lastImportMatch) {
      const lastImport = lastImportMatch[lastImportMatch.length - 1];
      const typeImport = "import type { Asset } from '@/types';";
      content = content.replace(lastImport, lastImport + '\n' + typeImport);
      changes++;
      console.log('   ✅ Added Asset type import');
    }
  }

  return { content, changes };
}

function processAllFiles() {
  console.log('🧹 Mock Data Removal Cleanup');
  console.log('============================\n');

  const files = fs.readdirSync(pagesDir)
    .filter(file => file.endsWith('.tsx') && !file.endsWith('.backup'))
    .map(file => path.join(pagesDir, file));

  let totalChanges = 0;
  let processedFiles = 0;

  files.forEach(filePath => {
    try {
      const originalContent = fs.readFileSync(filePath, 'utf-8');
      const { content: newContent, changes } = cleanupFile(filePath);
      
      if (changes > 0) {
        // Create another backup before cleanup
        const cleanupBackupPath = filePath + '.pre-cleanup-backup';
        fs.writeFileSync(cleanupBackupPath, originalContent, 'utf-8');
        
        // Write cleaned content
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log(`   💾 Pre-cleanup backup: ${path.basename(cleanupBackupPath)}`);
        console.log(`   ✅ Applied ${changes} cleanup fixes\n`);
        
        totalChanges += changes;
      } else {
        console.log('   ✅ No cleanup needed\n');
      }
      
      processedFiles++;
    } catch (error) {
      console.error(`   ❌ Error cleaning ${path.basename(filePath)}: ${error.message}\n`);
    }
  });

  console.log(`📈 CLEANUP SUMMARY:`);
  console.log(`   📁 Files processed: ${processedFiles}`);
  console.log(`   🔧 Total fixes applied: ${totalChanges}`);
  console.log(`   ✅ Cleanup complete!`);
}

// Additional function to verify the transformation
function verifyTransformation() {
  console.log('\n🔍 Verifying Mock Data Removal...\n');
  
  const files = fs.readdirSync(pagesDir)
    .filter(file => file.endsWith('.tsx') && !file.endsWith('.backup'))
    .map(file => path.join(pagesDir, file));

  let remainingMockRefs = 0;
  let filesWithIssues = [];

  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    
    // Check for remaining mock references
    const mockMatches = content.match(/\bmock\w+/g);
    if (mockMatches) {
      remainingMockRefs += mockMatches.length;
      filesWithIssues.push({
        file: fileName,
        issues: mockMatches.length,
        examples: mockMatches.slice(0, 3)
      });
    }
  });

  if (remainingMockRefs === 0) {
    console.log('✅ Perfect! No mock data references remain.');
  } else {
    console.log(`⚠️  Found ${remainingMockRefs} remaining mock references in ${filesWithIssues.length} files:`);
    filesWithIssues.forEach(file => {
      console.log(`   📄 ${file.file}: ${file.issues} references`);
      file.examples.forEach(example => {
        console.log(`      - ${example}`);
      });
    });
  }

  return remainingMockRefs === 0;
}

// Run cleanup
processAllFiles();

// Verify results
const isClean = verifyTransformation();

if (isClean) {
  console.log('\n🎉 Mock data removal completed successfully!');
  console.log('🚀 Ready to test the application with real data persistence.');
} else {
  console.log('\n⚠️  Some mock references may need manual cleanup.');
  console.log('🔍 Please review the files listed above.');
}
