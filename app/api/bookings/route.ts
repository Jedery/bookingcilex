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
    
    console.log('[Bookings API] Creating booking with data:', JSON.stringify(body, null, 2));
    
    // Generate unique booking ID
    const bookingId = `BK${Date.now()}`;
    
    const price = parseFloat(body.price) || 0;
    const deposit = parseFloat(body.deposit) || 0;
    const total = price;
    const toPay = total - deposit;
    
    // Se eventId è un numero o stringa vuota, imposta null
    let eventId = body.eventId;
    if (!eventId || eventId === '' || !isNaN(Number(eventId))) {
      eventId = null;
    }
    
    // Costruisci il nome completo
    const fullName = body.name || `${body.firstName || ''} ${body.lastName || ''}`.trim() || 'Cliente';
    
    const booking = await prisma.booking.create({
      data: {
        bookingId,
        name: fullName,
        firstName: body.firstName || null,
        lastName: body.lastName || null,
        email: body.email || '',
        country: body.country || null,
        phone: body.phone || null,
        notes: body.notes || null,
        adminNotes: body.adminNotes || null,
        status: body.status || 'Pending',
        paymentMethod: body.paymentMethod || null,
        price: price,
        discount: parseFloat(body.discount) || 0,
        tax: parseFloat(body.tax) || 0,
        total: total,
        deposit: deposit,
        depositPercent: body.depositPercent || false,
        toPay: toPay,
        coupon: body.coupon || null,
        guestList: body.guestList || null,
        guestListAccess: body.guestListAccess || null,
        gifts: body.gifts || null,
        booker: body.booker || null,
        emailLanguage: body.emailLanguage || 'en',
        eventId: eventId,
        eventName: body.eventName || null,
        eventDate: body.eventDate || null,
        eventTime: body.eventTime || null,
        soldBy: body.soldBy || null,
        soldByName: body.soldByName || null,
        salesZone: body.salesZone || null,
      },
    });

    console.log('[Bookings API] Booking created successfully:', booking.id);
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('[Bookings API] Error creating booking:', error);
    return NextResponse.json({ 
      error: 'Failed to create booking',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
