const { execSync } = require('child_process');
const path = require('path');

// Get the absolute path to the schema
const schemaPath = path.resolve(__dirname, '../../prisma/schema.prisma');

// Run the prisma command directly
try {
  console.log(`Generating Prisma client with schema at: ${schemaPath}`);
  execSync(`npx prisma generate --schema="${schemaPath}"`, { 
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: "postgresql://postgres.cpzhisetrbutoihvnahk:MKXRsNKJmgT2fI73@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
      DIRECT_URL: "postgresql://postgres.cpzhisetrbutoihvnahk:MKXRsNKJmgT2fI73@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
    }
  });
  console.log('Prisma client generated successfully');
} catch (error) {
  console.error('Error generating Prisma client:', error.message);
  process.exit(1);
}