#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const protectedPagesDir = path.join(__dirname, '../src/app/(protected)');

function addDynamicExport(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if dynamic export already exists
    if (content.includes('export const dynamic')) {
      console.log(`✅ ${filePath} already has dynamic export`);
      return;
    }
    
    // Find the first import statement
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Find the last import statement
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        insertIndex = i + 1;
      }
    }
    
    // Insert the dynamic export after imports
    lines.splice(insertIndex, 0, '');
    lines.splice(insertIndex + 1, 0, '// Force dynamic rendering');
    lines.splice(insertIndex + 2, 0, 'export const dynamic = \'force-dynamic\';');
    
    const newContent = lines.join('\n');
    fs.writeFileSync(filePath, newContent);
    
    console.log(`✅ Added dynamic export to ${filePath}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dir) {
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Recursively process subdirectories
        processDirectory(fullPath);
      } else if (item === 'page.tsx') {
        // Process page files
        addDynamicExport(fullPath);
      }
    }
  } catch (error) {
    console.error(`❌ Error processing directory ${dir}:`, error.message);
  }
}

console.log('🔧 Adding dynamic exports to protected pages...');
processDirectory(protectedPagesDir);
console.log('✅ Finished processing protected pages');
