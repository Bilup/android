import { spawn } from 'node:child_process';
import path from 'node:path';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const scriptPath = path.join(__dirname, 'prepare-extensions.mjs');

const result = spawn('node', [scriptPath], {
  stdio: 'inherit',
  shell: true
});

result.on('exit', (code) => {
  process.exit(code);
});

result.on('error', (err) => {
  console.error('Failed to start prepare-extensions script:', err);
  process.exit(1);
});
