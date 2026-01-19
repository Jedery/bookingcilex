import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET /api/housing - Ottieni lista proprietà con inquilini
export async function GET(request: NextRequest) {
  try {
    const properties = await prisma.property.findMany({
      where: { isActive: true },
      include: {
        tenants: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            rentAmount: true,
            rentType: true,
            walletBalance: true,
            moveInDate: true,
            moveOutDate: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ properties });
  } catch (error) {
    console.error('[Housing API] Error:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero delle proprietà' },
      { status: 500 }
    );
  }
}

// POST /api/housing - Crea nuova proprietà
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, address, monthlyRent, capacity, managedBy, notes } = body;

    if (!name || !monthlyRent || !capacity) {
      return NextResponse.json(
        { error: 'Nome, affitto mensile e capacità sono obbligatori' },
        { status: 400 }
      );
    }

    const property = await prisma.property.create({
      data: {
        name,
        address: address || '',
        monthlyRent: parseFloat(monthlyRent),
        capacity: parseInt(capacity),
        managedBy,
        notes,
        isActive: true,
      }
    });

    return NextResponse.json({ property }, { status: 201 });
  } catch (error) {
    console.error('[Housing API] Error creating property:', error);
    return NextResponse.json(
      { error: 'Errore nella creazione della proprietà' },
      { status: 500 }
    );
  }
}

// PATCH /api/housing - Assegna utente a proprietà
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, propertyId, rentAmount, rentType, moveInDate } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID è obbligatorio' },
        { status: 400 }
      );
    }

    const updateData: any = {
      propertyId: propertyId || null,
      rentAmount: rentAmount ? parseFloat(rentAmount) : null,
      rentType: rentType || null,
    };

    if (moveInDate) {
      updateData.moveInDate = new Date(moveInDate);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('[Housing API] Error updating user:', error);
    return NextResponse.json(
      { error: 'Errore nell\'assegnazione dell\'utente' },
      { status: 500 }
    );
  }
}
