import pathUtil from 'node:path';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import { promisify } from 'node:util';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathUtil.dirname(__filename);

const outputDirectory = pathUtil.join(__dirname, '../dist-extensions/');

// Clean up output directory
fs.rmSync(outputDirectory, {
  recursive: true,
  force: true,
});

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

// Run the build script in a subprocess
const child = spawn('node', [buildScriptPath, outputDirectory], {
  stdio: 'inherit',
  shell: false
});

child.on('exit', (code) => {
  // Clean up temporary script
  try {
    fs.unlinkSync(buildScriptPath);
  } catch (e) {
    // Ignore cleanup errors
  }
  
  if (code !== 0) {
    console.error('Build failed with exit code:', code);
    process.exit(code);
  }
});

child.on('error', (err) => {
  console.error('Failed to start build process:', err);
  process.exit(1);
});
