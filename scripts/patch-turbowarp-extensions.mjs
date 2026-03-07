import * as fs from 'node:fs';
import * as pathUtil from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathUtil.dirname(__filename);

const extensionsDir = pathUtil.join(__dirname, '../node_modules/@turbowarp/extensions');
const dependencyManagementPath = pathUtil.join(extensionsDir, 'development/dependency-management.js');

if (fs.existsSync(dependencyManagementPath)) {
  let content = fs.readFileSync(dependencyManagementPath, 'utf-8');
  
  // Replace zstdCompressSync with brotliCompressSync
  content = content.replace(
    /zlib\.zstdCompressSync/g,
    'zlib.brotliCompressSync'
  );
  
  // Replace zstdDecompressSync with brotliDecompressSync
  content = content.replace(
    /zlib\.zstdDecompressSync/g,
    'zlib.brotliDecompressSync'
  );
  
  fs.writeFileSync(dependencyManagementPath, content, 'utf-8');
  console.log('Patched @turbowarp/extensions/dependency-management.js');
} else {
  console.log('dependency-management.js not found, skipping patch');
}
