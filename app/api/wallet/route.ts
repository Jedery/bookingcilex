import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const period = searchParams.get('period') || 'all'; // all, month, week

    console.log('[Wallet API] Request for userId:', userId, 'period:', period);

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user with wallet balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        walletBalance: true,
        rentAmount: true,
        rentType: true,
        bankAccount: true,
        paymentMethod: true,
      },
    });

    console.log('[Wallet API] User found:', user ? user.name : 'null');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate date filter
    let dateFilter: any = {};
    if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { gte: weekAgo };
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { gte: monthAgo };
    }

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('[Wallet API] Transactions found:', transactions.length);

    // Calculate stats
    const totalIncome = transactions
      .filter((t) => t.amount > 0 && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.amount < 0 && t.status === 'completed')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const pendingTransactions = transactions.filter(
      (t) => t.status === 'pending'
    ).length;

    const response = {
      user,
      transactions,
      stats: {
        currentBalance: user.walletBalance || 0,
        totalIncome,
        totalExpenses,
        pendingTransactions,
      },
    };

    console.log('[Wallet API] Sending response, stats:', response.stats);

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Wallet API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
