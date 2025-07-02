#!/usr/bin/env node
/**
 * JSDoc to Markdown Extractor
 * 
 * This script parses TypeScript files with JSDoc comments and generates
 * Markdown documentation for the Artinet Documentation.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const SDK_SRC_DIR = path.resolve(__dirname, '../artinet-sdk/src');
const DOCS_API_DIR = path.resolve(__dirname, 'docs/api');

// Primary modules to document
const MODULES = [
  { src: 'client/a2a-client.ts', dest: 'client.md', title: 'A2AClient' },
  { src: 'server/a2a-server.ts', dest: 'server.md', title: 'A2AServer' },
  { src: 'types/services/context.ts', dest: 'task-context.md', title: 'Task Context' },
  { src: 'utils/deployment/bundler.ts', dest: 'bundler.md', title: 'Agent Bundler' },
];

/**
 * Extract JSDoc comments from a TypeScript file
 */
function extractJSDoc(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Updated regex to handle async functions and classes with implements clauses
  const jsdocRegex = /\/\*\*\s*([\s\S]*?)\s*\*\/\s*(?:export\s+)?(?:(?:async\s+)?(?:class|interface|type|function|const|let|var)\s+(\w+)|(?:export\s+)(?:async\s+)?(?:class|interface|type|function|const|let|var)\s+(\w+))/g;
  
  const docs = [];
  let match;
  
  while ((match = jsdocRegex.exec(content)) !== null) {
    const comment = match[1].replace(/^\s*\* ?/gm, '');
    const name = match[2] || match[3];
    
    // Get the position of the matched declaration
    const declarationStart = match.index + match[0].length;
    
    // Find the actual code block that follows
    let codeBlock = extractCodeBlock(content, declarationStart);
    
    // If the extracted code is empty, try a more aggressive approach for class/interface/function definitions
    if (!codeBlock || codeBlock.trim() === '') {
      codeBlock = extractCompleteCodeBlock(content, match.index);
    }
    
    docs.push({
      name,
      comment,
      code: codeBlock
    });
  }
  
  return docs;
}

/**
 * Extract the code block following a JSDoc comment
 */
function extractCodeBlock(content, startIndex) {
  let depth = 0;
  let inString = false;
  let stringChar = '';
  let endIndex = startIndex;
  
  // Handle class/interface definitions spanning multiple lines
  for (let i = startIndex; i < content.length; i++) {
    const char = content[i];
    
    if (!inString) {
      if (char === '{') depth++;
      if (char === '}') {
        depth--;
        if (depth === 0) {
          endIndex = i + 1;
          break;
        }
      }
    }
    
    if ((char === '"' || char === "'" || char === '`') && 
        (i === 0 || content[i-1] !== '\\')) {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
    }
  }
  
  return content.substring(startIndex, endIndex).trim();
}

/**
 * Extract a complete code block for a class or function
 * Used as a fallback when the standard extraction fails
 */
function extractCompleteCodeBlock(content, jsdocStartIndex) {
  // Find the end of the JSDoc comment
  const jsdocEndIndex = content.indexOf('*/', jsdocStartIndex) + 2;
  
  // Skip any whitespace after the JSDoc
  let codeStartIndex = jsdocEndIndex;
  while (codeStartIndex < content.length && /\s/.test(content[codeStartIndex])) {
    codeStartIndex++;
  }
  
  // Check if it's a class, function, or other exported declaration
  const exportLine = content.substring(codeStartIndex, codeStartIndex + 100).trim();
  
  if (exportLine.includes('export') || 
      exportLine.includes('class') || 
      exportLine.includes('function') || 
      exportLine.includes('interface') ||
      exportLine.includes('type') ||
      exportLine.includes('const') ||
      exportLine.includes('async')) {
    
    // Find the first opening brace for class/interface/function body
    let openBraceIndex = content.indexOf('{', codeStartIndex);
    // For classes or functions with implements/extends clauses or type params
    if (openBraceIndex > 0) {
      let depth = 1;
      let closeBraceIndex = openBraceIndex + 1;
      
      // Track braces to find the matching closing brace
      while (depth > 0 && closeBraceIndex < content.length) {
        if (content[closeBraceIndex] === '{') {
          depth++;
        } else if (content[closeBraceIndex] === '}') {
          depth--;
        }
        closeBraceIndex++;
      }
      
      // If we found a complete class/function body
      if (depth === 0) {
        // Extract the complete declaration including the export statement
        return content.substring(codeStartIndex, closeBraceIndex).trim();
      }
    }
    
    // For type declarations or functions without braces
    const endOfLineIndex = content.indexOf('\n\n', codeStartIndex);
    if (endOfLineIndex > 0) {
      return content.substring(codeStartIndex, endOfLineIndex).trim();
    }
  }
  
  // Return a reasonable snippet if we can't determine the full block
  const nextHundredChars = content.substring(codeStartIndex, codeStartIndex + 300);
  return nextHundredChars.split('\n\n')[0].trim();
}

/**
 * Convert JSDoc to Markdown
 */
function jsdocToMarkdown(docs, title) {
  let markdown = `# ${title}\n\n`;
  
  for (const doc of docs) {
    markdown += `## ${doc.name}\n\n${doc.comment}\n\n`;
    markdown += '```typescript\n' + doc.code + '\n```\n\n';
  }
  
  return markdown;
}

/**
 * Main function
 */
function generateApiDocs() {
  console.log('Generating API documentation from JSDoc comments...');
  
  if (!fs.existsSync(DOCS_API_DIR)) {
    fs.mkdirSync(DOCS_API_DIR, { recursive: true });
  }
  
  for (const module of MODULES) {
    const srcPath = path.join(SDK_SRC_DIR, module.src);
    const destPath = path.join(DOCS_API_DIR, module.dest);
    
    console.log(`Processing ${module.src} -> ${module.dest}`);
    
    try {
      const docs = extractJSDoc(srcPath);
      const markdown = jsdocToMarkdown(docs, module.title);
      fs.writeFileSync(destPath, markdown);
      console.log(`- Generated ${module.dest}`);
    } catch (error) {
      console.error(`Error processing ${module.src}: ${error.message}`);
    }
  }
  
  console.log('API documentation generation complete!');
}

// Run the script
generateApiDocs();
