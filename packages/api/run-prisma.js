const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the absolute path to the schema
const schemaPath = path.resolve(__dirname, '../../prisma/schema.prisma');

// Ensure the schema file exists
if (!fs.existsSync(schemaPath)) {
  console.error(`Schema file not found at: ${schemaPath}`);
  process.exit(1);
}

// Get the command from arguments
const command = process.argv[2] || 'generate';
const additionalArgs = process.argv.slice(3).join(' ');

// Run the prisma command with the explicit schema path
try {
  const cmd = `npx prisma ${command} --schema="${schemaPath}" ${additionalArgs}`;
  console.log(`Running: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
} catch (error) {
  console.error('Error running Prisma command:', error.message);
  process.exit(1);
}

