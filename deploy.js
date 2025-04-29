
const fs = require('fs');
const path = require('path');

// Function to copy web.config to the build folder
function copyWebConfig() {
  const source = path.join(__dirname, 'web.config');
  const destination = path.join(__dirname, 'dist', 'web.config');
  
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, destination);
    console.log('✅ web.config copied to dist folder');
  } else {
    console.error('❌ web.config not found in root directory');
  }
}

// Copy web.config
copyWebConfig();