const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const eventNames = ['Boat Party Ibiza', 'Ushuaia Club Night', 'Pacha Experience', 'Amnesia Opening', 'Hi Ibiza Night', 'Beach Club Day', 'Sunset Strip Session', 'Private Villa Party'];
const statuses = ['Confirmed', 'Pending'];
const paymentMethods = ['Cash', 'Card', 'Transfer'];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateRandomBooking(users, bookingIndex) {
  // Pick a random user from the team as the client
  const clientUser = getRandomElement(users);
  
  // Pick a random seller (who created the booking)
  const sellerUser = getRandomElement(users);
  
  const eventName = getRandomElement(eventNames);
  const status = getRandomElement(statuses);
  const paymentMethod = getRandomElement(paymentMethods);
  
  const startDate = new Date('2026-01-20');
  const endDate = new Date('2026-07-29');
  const bookingDate = getRandomDate(startDate, endDate);
  
  const basePrice = Math.floor(Math.random() * 200) + 50; // 50-250
  const tax = basePrice * 0.1; // 10% tax
  const discount = Math.random() > 0.8 ? 10 : 0; // 20% chance of discount
  const total = basePrice + tax - discount;
  
  let toPay = total;
  if (status === 'Confirmed') {
    toPay = 0; // Fully paid
  } else if (status === 'Pending') {
    toPay = Math.random() > 0.5 ? total * 0.7 : total;
  }
  
  const bookingId = `BK-${String(bookingIndex + 1000).padStart(4, '0')}`;
  
  // Use client user's name parts
  const nameParts = clientUser.name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || nameParts[0];

  return {
    bookingId,
    eventName,
    eventDate: bookingDate.toLocaleDateString(),
    eventTime: '22:00',
    name: clientUser.name,
    firstName,
    lastName,
    email: clientUser.email,
    status,
    paymentMethod,
    price: basePrice,
    tax,
    discount,
    total,
    toPay,
    soldBy: sellerUser.id,
    soldByName: sellerUser.name,
    createdAt: bookingDate,
    updatedAt: bookingDate,
    location: 'Ibiza',
    guestListAccess: 'Standard',
  };
}

async function main() {
  console.log('🌱 Starting bookings seed...');

  // Get only the generated users (Founders, Managers, Promoters)
  // Exclude superadmin
  const users = await prisma.user.findMany({
    where: {
      email: {
        not: 'ignazioibiza@gmail.com'
      }
    }
  });

  if (users.length === 0) {
    console.error('❌ No users found to assign bookings to. Please run the main seed first.');
    return;
  }

  console.log(`Found ${users.length} users to assign bookings to.`);

  // First delete all existing bookings
  console.log('🗑️  Deleting existing bookings...');
  await prisma.booking.deleteMany({});
  console.log('✅ Deleted all existing bookings');

  const bookings = [];
  const TOTAL_BOOKINGS = 300;

  for (let i = 0; i < TOTAL_BOOKINGS; i++) {
    bookings.push(generateRandomBooking(users, i));
  }

  console.log(`Generating ${bookings.length} bookings...`);

  // Insert in chunks to be safe
  const chunkSize = 50;
  for (let i = 0; i < bookings.length; i += chunkSize) {
    const chunk = bookings.slice(i, i + chunkSize);
    await prisma.booking.createMany({
      data: chunk,
    });
    console.log(`Inserted bookings ${i + 1} to ${Math.min(i + chunkSize, bookings.length)}`);
  }

  console.log('✅ 300 Sample bookings created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });