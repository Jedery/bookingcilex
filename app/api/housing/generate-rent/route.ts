import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// POST /api/housing/generate-rent - Genera transazioni affitto per tutti gli inquilini
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { period, createdBy, createdByName } = body; // period: "Settimana 1", "Gennaio 2026", etc.

    if (!period || !createdBy) {
      return NextResponse.json(
        { error: 'Period e createdBy sono obbligatori' },
        { status: 400 }
      );
    }

    // Trova tutti gli utenti con affitto attivo
    const users = await prisma.user.findMany({
      where: {
        rentAmount: { not: null },
        rentType: { not: null },
        propertyId: { not: null },
        isActive: true,
      }
    });

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Nessun inquilino trovato con affitto attivo' },
        { status: 200 }
      );
    }

    const transactions = [];

    // Crea transazione per ogni utente
    for (const user of users) {
      const rentAmount = user.rentAmount || 0;
      const newBalance = user.walletBalance - rentAmount;

      // Crea transazione negativa
      const transaction = await prisma.transaction.create({
        data: {
          userId: user.id,
          type: 'expense',
          category: 'rent',
          amount: -rentAmount, // Negativo perché è un'uscita
          balanceAfter: newBalance,
          description: `Affitto ${period}`,
          reference: `RENT-${period.replace(/\s+/g, '-')}`,
          status: 'completed',
          createdBy,
          createdByName,
        }
      });

      // Aggiorna saldo wallet
      await prisma.user.update({
        where: { id: user.id },
        data: { walletBalance: newBalance }
      });

      transactions.push(transaction);
    }

    return NextResponse.json({
      message: `Generate ${transactions.length} transazioni affitto per ${period}`,
      transactions,
    });
  } catch (error) {
    console.error('[Generate Rent API] Error:', error);
    return NextResponse.json(
      { error: 'Errore nella generazione delle transazioni affitto' },
      { status: 500 }
    );
  }
}
