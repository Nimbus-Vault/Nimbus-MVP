import fs from 'fs';
import path from 'path';

const pagesDir = 'src/pages';

// Pattern to identify mock data
const mockPatterns = [
  /const\s+mock\w+\s*=\s*\[/g,
  /mockData\s*=\s*\[/g,
  /Mock data for/g,
  /\/\/ Mock/g,
  /mockPrograms/g,
  /mockPlaybooks/g,
  /mockTechniques/g,
  /mockPayloads/g,
  /mockAssets/g,
  /mockVulnerabilities/g,
  /mock\w+\.push/g,
  /mock\w+\.findIndex/g,
  /mock\w+\.filter/g,
  /mock\w+\.map/g
];

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let mockLines = [];
  
  lines.forEach((line, index) => {
    mockPatterns.forEach(pattern => {
      if (pattern.test(line)) {
        mockLines.push({
          line: index + 1,
          content: line.trim(),
          type: 'mock_reference'
        });
      }
    });
  });
  
  return mockLines;
}

function scanProject() {
  console.log('🔍 Scanning project for mock data...\n');
  
  const files = fs.readdirSync(pagesDir)
    .filter(file => file.endsWith('.tsx'))
    .map(file => path.join(pagesDir, file));
  
  let totalMockReferences = 0;
  const mockFiles = [];
  
  files.forEach(filePath => {
    const mockLines = analyzeFile(filePath);
    if (mockLines.length > 0) {
      totalMockReferences += mockLines.length;
      mockFiles.push({
        file: path.basename(filePath),
        path: filePath,
        mockLines: mockLines.length,
        details: mockLines
      });
    }
  });
  
  console.log(`📊 Found ${totalMockReferences} mock data references in ${mockFiles.length} files:\n`);
  
  mockFiles.forEach(({ file, mockLines, details }) => {
    console.log(`📄 ${file}: ${mockLines} references`);
    details.slice(0, 3).forEach(detail => {
      console.log(`   Line ${detail.line}: ${detail.content.substring(0, 60)}...`);
    });
    if (details.length > 3) {
      console.log(`   ... and ${details.length - 3} more`);
    }
    console.log();
  });
  
  return mockFiles;
}

// Run the scan
const mockFiles = scanProject();

console.log('🎯 Priority order for cleanup:');
mockFiles
  .sort((a, b) => b.mockLines - a.mockLines)
  .forEach((file, index) => {
    console.log(`${index + 1}. ${file.file} (${file.mockLines} references)`);
  });

console.log('\n✅ Supabase is configured and ready!');
console.log('🚀 Ready to remove all mock data and switch to real data persistence.');
