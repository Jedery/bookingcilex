import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        event: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Generate unique booking ID
    const bookingId = `BK${Date.now()}`;
    
    const booking = await prisma.booking.create({
      data: {
        bookingId,
        name: body.name,
        email: body.email,
        country: body.country,
        phone: body.phone,
        notes: body.notes,
        adminNotes: body.adminNotes,
        status: body.status || 'Pending',
        paymentMethod: body.paymentMethod,
        price: parseFloat(body.price) || 0,
        discount: parseFloat(body.discount) || 0,
        tax: parseFloat(body.tax) || 0,
        total: parseFloat(body.total) || 0,
        deposit: parseFloat(body.deposit) || 0,
        depositPercent: body.depositPercent || false,
        toPay: parseFloat(body.toPay) || 0,
        coupon: body.coupon,
        guestList: body.guestList,
        gifts: body.gifts,
        booker: body.booker,
        emailLanguage: body.emailLanguage || 'en',
        eventId: body.eventId,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
