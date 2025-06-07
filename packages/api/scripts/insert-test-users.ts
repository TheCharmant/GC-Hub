import { prisma } from '@lib/prisma';
import { Role } from '@prisma/client';

async function main() {
  console.log('Inserting test users...');
  
  // Create test users for each role
  const testUsers = [
    {
      email: 'admin@example.com',
      name: 'Admin User',
      passwordHash: 'password123', // In production, use proper password hashing
      role: 'admin' as Role
    },
    {
      email: 'organizer@example.com',
      name: 'Organizer User',
      passwordHash: 'password123',
      role: 'organizer' as Role
    },
    {
      email: 'club@example.com',
      name: 'Club Leader',
      passwordHash: 'password123',
      role: 'club' as Role
    },
    {
      email: 'student@example.com',
      name: 'Student User',
      passwordHash: 'password123',
      role: 'student' as Role
    }
  ];
  
  // Insert users
  for (const userData of testUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData
    });
    
    console.log(`Created user: ${user.name} (${user.role})`);
    
    // Create a club for the club leader
    if (user.role === 'club') {
      const club = await prisma.club.upsert({
        where: { leaderId: user.id },
        update: {},
        create: {
          name: `${user.name}'s Club`,
          description: 'A test club for development',
          leaderId: user.id
        }
      });
      
      console.log(`Created club: ${club.name} for ${user.name}`);
    }
  }
  
  // Create a test event
  const clubLeader = await prisma.user.findFirst({
    where: { role: 'club' }
  });
  
  if (clubLeader) {
    const club = await prisma.club.findUnique({
      where: { leaderId: clubLeader.id }
    });
    
    if (club) {
      const event = await prisma.event.create({
        data: {
          title: 'Test Event',
          description: 'A test event for development',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          startTime: '10:00 AM',
          endTime: '12:00 PM',
          location: 'Test Location',
          approved: true,
          createdById: clubLeader.id,
          clubId: club.id
        }
      });
      
      console.log(`Created event: ${event.title}`);
      
      // Register the student for the event
      const student = await prisma.user.findFirst({
        where: { role: 'student' }
      });
      
      if (student) {
        const registration = await prisma.eventRegistration.create({
          data: {
            eventId: event.id,
            userId: student.id
          }
        });
        
        console.log(`Registered student for event: ${registration.id}`);
      }
    }
  }
  
  console.log('Test data insertion complete!');
}

main()
  .catch((e) => {
    console.error('Error inserting test data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });