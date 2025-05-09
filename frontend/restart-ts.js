const fs = require('fs');
const path = require('path');

// Get the current timestamp
const timestamp = new Date().getTime();

// Path to tsconfig.json
const tsconfigPath = path.join(__dirname, 'tsconfig.json');

// Read the current content
const content = fs.readFileSync(tsconfigPath, 'utf8');

// Write it back to force file update
fs.writeFileSync(tsconfigPath, content);

console.log('TypeScript server reload triggered'); 