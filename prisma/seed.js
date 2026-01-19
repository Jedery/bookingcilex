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

  let superAdmin;
  if (!existingSuperAdmin) {
    const hashedPassword = await bcrypt.hash('Cilexstart2026', 10);
    superAdmin = await prisma.user.create({
      data: {
        email: superAdminEmail,
        password: hashedPassword,
        name: 'Ignazio Ibiza',
        role: 'SuperAdmin',
        isActive: true,
        walletBalance: 0,
      },
    });
    console.log('✅ Created SuperAdmin user:');
    console.log('   Email: ignazioibiza@gmail.com');
    console.log('   Password: Cilexstart2026');
  } else {
    superAdmin = existingSuperAdmin;
    console.log('ℹ️  SuperAdmin user already exists');
  }

  // Create sample promoters with wallet data
  const promoters = [
    {
      email: 'marco.rossi@cilex.com',
      name: 'Marco Rossi',
      role: 'Promoter',
      rentAmount: 150,
      rentType: 'weekly',
      walletBalance: 450,
    },
    {
      email: 'sara.bianchi@cilex.com',
      name: 'Sara Bianchi',
      role: 'Promoter',
      rentAmount: 150,
      rentType: 'weekly',
      walletBalance: 680,
    },
    {
      email: 'luca.verdi@cilex.com',
      name: 'Luca Verdi',
      role: 'Manager',
      rentAmount: 200,
      rentType: 'weekly',
      walletBalance: 1020,
    },
  ];

  const createdPromoters = [];
  for (const promoterData of promoters) {
    const existing = await prisma.user.findUnique({
      where: { email: promoterData.email },
    });

    if (!existing) {
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      const promoter = await prisma.user.create({
        data: {
          ...promoterData,
          password: hashedPassword,
          isActive: true,
          bankAccount: 'IT00X0000000000000000000',
          paymentMethod: 'bank_transfer',
        },
      });
      createdPromoters.push(promoter);
      console.log(`✅ Created user: ${promoter.name} (${promoter.role})`);

      // Create sample transactions for each promoter
      const transactions = [
        {
          type: 'commission',
          category: 'booking',
          amount: 50,
          description: 'Commissione Booking #BK001',
          balanceAfter: 50,
          createdBy: superAdmin.id,
          createdByName: superAdmin.name,
        },
        {
          type: 'commission',
          category: 'booking',
          amount: 50,
          description: 'Commissione Booking #BK002',
          balanceAfter: 100,
          createdBy: superAdmin.id,
          createdByName: superAdmin.name,
        },
        {
          type: 'expense',
          category: 'rent',
          amount: -150,
          description: 'Affitto Settimana 2 - Gennaio 2026',
          balanceAfter: promoter.walletBalance,
          createdBy: 'system',
          createdByName: 'Sistema Automatico',
        },
      ];

      for (const txData of transactions) {
        await prisma.transaction.create({
          data: {
            userId: promoter.id,
            ...txData,
          },
        });
      }
      console.log(`   💰 Created ${transactions.length} sample transactions`);
    } else {
      createdPromoters.push(existing);
    }
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
