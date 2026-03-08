import pathUtil from 'node:path';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import { promisify } from 'node:util';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathUtil.dirname(__filename);

// For Capacitor, output to dist-renderer-webpack so it's included in the app
const outputDirectory = pathUtil.join(__dirname, '../dist-renderer-webpack/extensions/');

// Clean up output directory
fs.rmSync(outputDirectory, {
  recursive: true,
  force: true,
});

// Run patch script first
const patchScriptPath = pathUtil.join(__dirname, 'patch-turbowarp-extensions.mjs');
const patchProcess = spawn('node', [patchScriptPath], {
  stdio: 'inherit',
  shell: false
});

patchProcess.on('exit', (patchCode) => {
  if (patchCode !== 0) {
    console.error('Patch failed with exit code:', patchCode);
    process.exit(patchCode);
  }
  
  // Create a temporary script to build extensions
  const buildScript = `
import pathUtil from 'node:path';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import { promisify } from 'node:util';
import zlib from 'node:zlib';
import Builder from '@turbowarp/extensions/builder';

const mode = 'desktop';
const builder = new Builder(mode);
const build = await builder.build();
console.log('Built extensions (mode: ' + mode + ')');

const outputDirectory = process.argv[2];

const brotliCompress = promisify(zlib.brotliCompress);

const exportFile = async (relativePath, file) => {
  const contents = await file.read();
  console.log('Generated ' + relativePath);

  const compressed = await brotliCompress(contents);

  const directoryName = pathUtil.dirname(relativePath);
  await fsPromises.mkdir(pathUtil.join(outputDirectory, directoryName), {
    recursive: true
  });

  await fsPromises.writeFile(pathUtil.join(outputDirectory, relativePath + '.br'), compressed);

  console.log('Compressed ' + relativePath);
};

const promises = Object.entries(build.files).map(([relativePath, file]) => exportFile(relativePath, file));
Promise.all(promises)
  .then(() => {
    console.log('Exported to ' + outputDirectory);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
`;

  const buildScriptPath = pathUtil.join(__dirname, '_build-extensions-temp.mjs');
  fs.writeFileSync(buildScriptPath, buildScript, 'utf-8');

  // Run build script in a subprocess
  const buildProcess = spawn('node', [buildScriptPath, outputDirectory], {
    stdio: 'inherit',
    shell: false
  });

  buildProcess.on('exit', (buildCode) => {
    // Clean up temporary script
    try {
      fs.unlinkSync(buildScriptPath);
    } catch (e) {
      // Ignore cleanup errors
    }
    
    if (buildCode !== 0) {
      console.error('Build failed with exit code:', buildCode);
      process.exit(buildCode);
    }
  });

  buildProcess.on('error', (err) => {
    console.error('Failed to start build process:', err);
    process.exit(1);
  });
});

patchProcess.on('error', (err) => {
  console.error('Failed to start patch process:', err);
  process.exit(1);
});
