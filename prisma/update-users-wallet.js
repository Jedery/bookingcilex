const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating users with wallet fields...');

  // Update all existing users to have wallet fields
  const users = await prisma.user.findMany();
  
  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        walletBalance: user.walletBalance ?? 0,
        rentAmount: user.rentAmount ?? null,
        rentType: user.rentType ?? null,
        bankAccount: user.bankAccount ?? null,
        paymentMethod: user.paymentMethod ?? null,
      },
    });
    console.log(`✅ Updated ${user.name} (${user.email})`);
  }

  console.log('✅ All users updated successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
