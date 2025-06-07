const fs = require('fs');
const path = require('path');

// Paths
const schemaPath = path.resolve(__dirname, '../../prisma/schema.prisma');
const targetDir = path.resolve(__dirname, './prisma');
const targetPath = path.resolve(targetDir, 'schema.prisma');

// Create the prisma directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy the schema file instead of creating a symlink
try {
  // Read the original schema
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  // Write to the target location
  fs.writeFileSync(targetPath, schemaContent);
  
  console.log('Schema file copied successfully');
} catch (error) {
  console.error('Error copying schema file:', error);
}




