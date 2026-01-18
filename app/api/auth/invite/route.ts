import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Only SuperAdmin or Founder can generate invites
    if (user.role !== 'SuperAdmin' && user.role !== 'Founder') {
      return NextResponse.json(
        { error: 'Unauthorized. Only SuperAdmin or Founder can generate invites.' },
        { status: 403 }
      );
    }

    // Generate unique token
    const inviteToken = randomBytes(32).toString('hex');

    // Update user with invite token
    await prisma.user.update({
      where: { id: userId },
      data: { inviteToken },
    });

    // Generate invite link
    const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/register?token=${inviteToken}`;

    return NextResponse.json({
      inviteToken,
      inviteLink,
      message: 'Invite generated successfully',
    });
  } catch (error) {
    console.error('Invite generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
