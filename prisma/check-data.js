const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking database data...\n');

  // Check users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    }
  });

  console.log(`📊 Total users: ${users.length}\n`);
  users.forEach(user => {
    console.log(`  - ${user.name} (${user.role}) - ID: ${user.id.substring(0, 8)}...`);
  });

  // Check bookings and who they're assigned to
  const bookings = await prisma.booking.findMany({
    select: {
      id: true,
      bookingId: true,
      soldBy: true,
      soldByName: true,
      status: true,
    },
    take: 10
  });

  console.log(`\n📊 Sample of bookings (first 10):\n`);
  bookings.forEach(booking => {
    console.log(`  - ${booking.bookingId}: Sold by "${booking.soldByName}" (ID: ${booking.soldBy ? booking.soldBy.substring(0, 8) + '...' : 'NULL'})`);
  });

  // Count bookings per user
  const bookingsPerUser = await prisma.booking.groupBy({
    by: ['soldByName'],
    _count: {
      id: true
    }
  });

  console.log(`\n📊 Bookings count per user:\n`);
  bookingsPerUser.forEach(item => {
    console.log(`  - ${item.soldByName}: ${item._count.id} bookings`);
  });

  // Check if soldBy IDs match actual user IDs
  const userIds = users.map(u => u.id);
  const bookingsWithInvalidUsers = await prisma.booking.count({
    where: {
      soldBy: {
        notIn: userIds
      }
    }
  });

  console.log(`\n❌ Bookings with invalid/mismatched soldBy: ${bookingsWithInvalidUsers}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
