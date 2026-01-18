const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
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
