const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create superadmin user if not exists
  const superAdminEmail = 'ignazioibiza@gmail.com';
  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (!existingSuperAdmin) {
    const hashedPassword = await bcrypt.hash('Cilexstart2026', 10);
    await prisma.user.create({
      data: {
        email: superAdminEmail,
        password: hashedPassword,
        name: 'Ignazio Ibiza',
        role: 'SuperAdmin',
        isActive: true,
      },
    });
    console.log('✅ Created SuperAdmin user:');
    console.log('   Email: ignazioibiza@gmail.com');
    console.log('   Password: Cilexstart2026');
  } else {
    console.log('ℹ️  SuperAdmin user already exists');
  }

  // Clear existing events
  await prisma.event.deleteMany();

  // Create 5 Boat Party AM events
  const amEvents = [];
  for (let i = 1; i <= 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    date.setHours(10, 0, 0, 0);
    
    amEvents.push({
      name: `Boat Party Ibiza - Morning ${i}`,
      date: date,
      category: '10:00 AM',
    });
  }

  // Create 5 Boat Party PM events
  const pmEvents = [];
  for (let i = 1; i <= 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i + 5);
    date.setHours(22, 0, 0, 0);
    
    pmEvents.push({
      name: `Boat Party Ibiza - Night ${i}`,
      date: date,
      category: '10:00 PM',
    });
  }

  // Insert all events
  const allEvents = [...amEvents, ...pmEvents];
  for (const event of allEvents) {
    await prisma.event.create({
      data: event,
    });
  }

  console.log('✅ Seeded 10 events successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
