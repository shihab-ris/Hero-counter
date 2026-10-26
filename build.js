const fs = require('fs');
const path = require('path');

const dir = __dirname;
let data = fs.readFileSync(path.join(dir, 'data.js'), 'utf8');
let audio = fs.readFileSync(path.join(dir, 'audio.js'), 'utf8');
let engine = fs.readFileSync(path.join(dir, 'counterEngine.js'), 'utf8');
let app = fs.readFileSync(path.join(dir, 'app.js'), 'utf8');

// Strip exports and imports for standalone bundle
data = data.replace(/^export\s+/gm, '');
audio = audio.replace(/^export\s+/gm, '');
engine = engine.replace(/^import\s+[^;]+;\s*$/gm, '').replace(/^export\s+/gm, '');
app = app.replace(/^import\s+[^;]+;\s*$/gm, '');

const bundle = `// Bundled MLBB Counter Assistant for standalone (file://) and server (http://) compatibility
(function() {
  'use strict';
${data}

${audio}

${engine}

${app}
})();
`;

fs.writeFileSync(path.join(dir, 'bundle.js'), bundle, 'utf8');
console.log('Successfully bundled bundle.js! Size: ' + bundle.length + ' bytes');
