import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Building standalone single-file HTML for Gumroad...');

// 1. Run vite build with singlefile config
execSync('npx vite build --config vite.config.singlefile.ts', {
  cwd: rootDir,
  stdio: 'inherit',
});

const distSinglePath = path.join(rootDir, 'dist-single', 'index.html');
if (!fs.existsSync(distSinglePath)) {
  console.error('❌ Failed to find dist-single/index.html');
  process.exit(1);
}

let html = fs.readFileSync(distSinglePath, 'utf8');

// 2. Remove external font links to guarantee ZERO external requests (100% offline & Gumroad policy compliant)
html = html.replace(/<link rel="preconnect"[^>]*>/gi, '');
html = html.replace(/<link[^>]*fonts\.googleapis\.com[^>]*>/gi, '');

// 3. Inject offline-ready styling guarantees
const offlineFontFallback = `
<style>
  /* Standalone Offline Fallbacks */
  body, button, input, select, textarea {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
  }
  h1, h2, h3, .font-display {
    font-family: Georgia, Cambria, 'Times New Roman', Times, serif !important;
  }
</style>
`;
html = html.replace('</head>', `${offlineFontFallback}\n</head>`);

// 4. Save to destinations:
// - Root: /quick-response-mini-app.html (for GitHub export / local inspection)
// - Public: /public/quick-response-mini-app.html (for in-browser 1-click download)
// - Dist: /dist/quick-response-mini-app.html (for production distribution)
const rootDest = path.join(rootDir, 'quick-response-mini-app.html');
const publicDest = path.join(rootDir, 'public', 'quick-response-mini-app.html');
const distDest = path.join(rootDir, 'dist', 'quick-response-mini-app.html');

fs.writeFileSync(rootDest, html, 'utf8');
fs.writeFileSync(publicDest, html, 'utf8');

if (fs.existsSync(path.join(rootDir, 'dist'))) {
  fs.writeFileSync(distDest, html, 'utf8');
}

const stats = fs.statSync(rootDest);
const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

console.log(`✅ Standalone single-file HTML successfully generated!`);
console.log(`📁 File: quick-response-mini-app.html (${sizeMb} MB)`);
console.log(`📍 Saved to:`);
console.log(`   - ${rootDest}`);
console.log(`   - ${publicDest}`);
