import { prisma } from '@lib/prisma';

async function main() {
  console.log('Initializing database...');
  
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      passwordHash: 'hashed_password_here', // In production, use proper password hashing
      role: 'admin'
    }
  });
  
  console.log('Admin user created:', admin.id);
  
  // Create sample club
  const club = await prisma.club.upsert({
    where: { name: 'Sample Club' },
    update: {},
    create: {
      name: 'Sample Club',
      description: 'This is a sample club for testing',
      leader: {
        connect: { id: admin.id }
      }
    }
  });
  
  console.log('Sample club created:', club.id);
  
  console.log('Database initialization complete!');
}

main()
  .catch((e) => {
    console.error('Error initializing database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });