const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAnalyticsData() {
  try {
    // 1. Locations
    const bookings = await prisma.booking.findMany({
      select: {
        location: true,
        status: true,
        total: true,
        soldByName: true,
        createdAt: true,
      }
    });

    const locations = [...new Set(bookings.map(b => b.location))].filter(Boolean);
    console.log('\n📍 LOCATIONS:', locations);
    console.log('\n📊 Total Bookings:', bookings.length);

    // 2. Performance per location
    const locationStats = {};
    bookings.forEach(b => {
      if (b.location) {
        if (!locationStats[b.location]) {
          locationStats[b.location] = { sales: 0, revenue: 0, confirmed: 0 };
        }
        locationStats[b.location].sales++;
        if (b.status === 'Confirmed') {
          locationStats[b.location].confirmed++;
          locationStats[b.location].revenue += b.total;
        }
      }
    });

    console.log('\n📈 LOCATION PERFORMANCE:');
    Object.entries(locationStats)
      .sort((a, b) => b[1].sales - a[1].sales)
      .forEach(([loc, stats]) => {
        console.log(`${loc}: ${stats.sales} sales, €${stats.revenue.toFixed(0)} revenue, ${stats.confirmed} confirmed`);
      });

    // 3. Users performance
    const users = await prisma.user.findMany({
      where: { role: { not: 'SuperAdmin' } },
      select: { id: true, name: true, role: true }
    });

    console.log('\n👥 USERS:');
    for (const user of users) {
      const userBookings = bookings.filter(b => b.soldByName === user.name);
      const confirmed = userBookings.filter(b => b.status === 'Confirmed');
      const revenue = confirmed.reduce((sum, b) => sum + b.total, 0);
      console.log(`${user.name} (${user.role}): ${userBookings.length} sales, €${revenue.toFixed(0)} revenue`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAnalyticsData();
