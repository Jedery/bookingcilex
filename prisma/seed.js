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

  // Delete all users except SuperAdmin
  console.log('🗑️  Deleting existing users (except SuperAdmin)...');
  await prisma.user.deleteMany({
    where: {
      email: {
        not: superAdminEmail,
      },
    },
  });
  console.log('✅ Deleted all users except SuperAdmin');

  // Create 10 sample users: 2 Founders, 3 Managers, 5 Promoters
  const sampleUsers = [
    // 2 Founders
    {
      email: 'andrea.founder@cilex.com',
      name: 'Andrea Martini',
      role: 'Founder',
      rentAmount: 0,
      rentType: 'monthly',
      walletBalance: 5200,
    },
    {
      email: 'giulia.founder@cilex.com',
      name: 'Giulia Romano',
      role: 'Founder',
      rentAmount: 0,
      rentType: 'monthly',
      walletBalance: 4800,
    },
    // 3 Managers
    {
      email: 'luca.verdi@cilex.com',
      name: 'Luca Verdi',
      role: 'Manager',
      rentAmount: 200,
      rentType: 'weekly',
      walletBalance: 2400,
    },
    {
      email: 'francesca.manager@cilex.com',
      name: 'Francesca Conti',
      role: 'Manager',
      rentAmount: 200,
      rentType: 'weekly',
      walletBalance: 2100,
    },
    {
      email: 'alessandro.manager@cilex.com',
      name: 'Alessandro Ricci',
      role: 'Manager',
      rentAmount: 200,
      rentType: 'weekly',
      walletBalance: 1950,
    },
    // 5 Promoters
    {
      email: 'marco.rossi@cilex.com',
      name: 'Marco Rossi',
      role: 'Promoter',
      rentAmount: 150,
      rentType: 'weekly',
      walletBalance: 1200,
    },
    {
      email: 'sara.bianchi@cilex.com',
      name: 'Sara Bianchi',
      role: 'Promoter',
      rentAmount: 150,
      rentType: 'weekly',
      walletBalance: 1680,
    },
    {
      email: 'davide.promoter@cilex.com',
      name: 'Davide Ferretti',
      role: 'Promoter',
      rentAmount: 150,
      rentType: 'weekly',
      walletBalance: 890,
    },
    {
      email: 'chiara.promoter@cilex.com',
      name: 'Chiara Moretti',
      role: 'Promoter',
      rentAmount: 150,
      rentType: 'weekly',
      walletBalance: 1150,
    },
    {
      email: 'matteo.promoter@cilex.com',
      name: 'Matteo Russo',
      role: 'Promoter',
      rentAmount: 150,
      rentType: 'weekly',
      walletBalance: 950,
    },
  ];

  const createdUsers = [];
  for (const userData of sampleUsers) {
    const hashedPassword = await bcrypt.hash('Cilex', 10);
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        isActive: true,
        bankAccount: 'IT00X0000000000000000000',
        paymentMethod: 'bank_transfer',
      },
    });
    createdUsers.push(user);
    console.log(`✅ Created user: ${user.name} (${user.role}) - Balance: €${user.walletBalance}`);

    // Create sample transactions for each user
    const transactionCount = Math.floor(Math.random() * 5) + 3; // 3-7 transactions
    for (let i = 0; i < transactionCount; i++) {
      await prisma.transaction.create({
        data: {
          userId: user.id,
          type: i % 2 === 0 ? 'commission' : 'expense',
          category: i % 2 === 0 ? 'booking' : 'rent',
          amount: i % 2 === 0 ? Math.floor(Math.random() * 100) + 50 : -(Math.floor(Math.random() * 50) + 100),
          description: i % 2 === 0 ? `Commissione Booking #BK${String(i + 1).padStart(3, '0')}` : `Affitto Settimana ${i + 1}`,
          balanceAfter: user.walletBalance,
          createdBy: superAdmin.id,
          createdByName: superAdmin.name,
        },
      });
    }
    console.log(`   💰 Created ${transactionCount} sample transactions`);
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
  const createdEvents = [];
  for (const event of allEvents) {
    const createdEvent = await prisma.event.create({
      data: event,
    });
    createdEvents.push(createdEvent);
  }

  console.log('✅ Seeded 10 events successfully!');

  // Delete all existing bookings
  console.log('🗑️  Deleting existing bookings...');
  await prisma.booking.deleteMany();
  console.log('✅ Deleted all bookings');

  // Create 3 bookings for each user
  console.log('📝 Creating sample bookings...');
  const countries = ['Italy', 'Spain', 'France', 'Germany', 'UK', 'USA', 'Netherlands', 'Belgium'];
  const firstNames = ['Marco', 'Luca', 'Giovanni', 'Andrea', 'Francesco', 'Alessandro', 'Lorenzo', 'Matteo', 'Davide', 'Riccardo'];
  const lastNames = ['Rossi', 'Bianchi', 'Russo', 'Ferrari', 'Esposito', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco'];
  const paymentMethods = ['cash', 'card', 'bank_transfer'];
  
  let bookingCounter = 1;
  
  for (const user of createdUsers) {
    // Create 3 bookings per user: 2 Confirmed, 1 Pending
    for (let i = 0; i < 3; i++) {
      const isConfirmed = i < 2; // First 2 are confirmed, 3rd is pending
      const event = createdEvents[Math.floor(Math.random() * createdEvents.length)];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const country = countries[Math.floor(Math.random() * countries.length)];
      const price = Math.floor(Math.random() * 100) + 50; // €50-€150
      const deposit = Math.floor(price * 0.3); // 30% deposit
      const toPay = price - deposit;
      
      const booking = await prisma.booking.create({
        data: {
          bookingId: `BK${String(bookingCounter).padStart(4, '0')}`,
          eventId: event.id,
          eventName: event.name,
          eventDate: event.date.toISOString().split('T')[0],
          eventTime: event.category,
          name: `${firstName} ${lastName}`,
          firstName: firstName,
          lastName: lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
          country: country,
          phone: `+39 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          notes: isConfirmed ? 'Cliente confermato' : 'In attesa di pagamento finale',
          adminNotes: `Venduto da ${user.name}`,
          status: isConfirmed ? 'Confirmed' : 'Pending',
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          price: price,
          discount: 0,
          tax: Math.floor(price * 0.22), // IVA 22%
          total: price,
          deposit: deposit,
          depositPercent: true,
          toPay: toPay,
          coupon: null,
          soldBy: user.id,
          soldByName: user.name,
          confirmedAt: isConfirmed ? new Date() : null,
          cancelledAt: null,
          guestList: null,
          guestListAccess: null,
          gifts: null,
          booker: 'online',
          emailLanguage: 'it',
        },
      });
      
      bookingCounter++;
    }
    console.log(`   ✅ Created 3 bookings for ${user.name} (2 Confirmed, 1 Pending)`);
  }

  console.log(`✅ Created ${bookingCounter - 1} total bookings!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
