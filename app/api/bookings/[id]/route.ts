import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// PUT /api/bookings/[id] - Aggiorna tutti i dati del booking
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    console.log('[Bookings API] Update request (PUT):', { id: params.id, body });

    const updateData: any = {
      name: body.name,
      firstName: body.firstName || null,
      lastName: body.lastName || null,
      email: body.email,
      country: body.country || null,
      phone: body.phone || null,
      notes: body.notes || null,
      adminNotes: body.adminNotes || null,
      status: body.status,
      paymentMethod: body.paymentMethod || null,
      price: parseFloat(body.price) || 0,
      deposit: parseFloat(body.deposit) || 0,
      total: parseFloat(body.total) || 0,
      toPay: parseFloat(body.toPay) || 0,
      eventName: body.eventName || null,
      eventDate: body.eventDate || null,
      eventTime: body.eventTime || null,
      updatedAt: new Date(),
    };

    // Se si sta confermando, salva timestamp
    if (body.status === 'Confirmed' && body.status !== body.previousStatus) {
      updateData.confirmedAt = new Date();
    }

    // Se si sta cancellando, salva timestamp
    if (body.status === 'Cancelled' && body.status !== body.previousStatus) {
      updateData.cancelledAt = new Date();
    }

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: updateData,
    });

    console.log('[Bookings API] Booking updated successfully:', booking.id);

    return NextResponse.json(booking);
  } catch (error) {
    console.error('[Bookings API] Error updating booking:', error);
    return NextResponse.json(
      { 
        error: 'Errore nell\'aggiornamento della prenotazione',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings/[id] - Aggiorna stato booking
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, userId, userRole } = body;

    console.log('[Bookings API] Update request:', { id: params.id, status, userRole });

    // Verifica che solo SuperAdmin possa confermare booking
    if (status === 'Confirmed' && userRole !== 'SuperAdmin') {
      return NextResponse.json(
        { error: 'Solo il SuperAdmin può confermare le prenotazioni' },
        { status: 403 }
      );
    }

    // Prepara i dati di aggiornamento
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    // Se si sta confermando, salva timestamp
    if (status === 'Confirmed') {
      updateData.confirmedAt = new Date();
    }

    // Se si sta cancellando, salva timestamp
    if (status === 'Cancelled') {
      updateData.cancelledAt = new Date();
    }

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: updateData,
    });

    console.log('[Bookings API] Booking updated successfully:', booking.id);

    return NextResponse.json(booking);
  } catch (error) {
    console.error('[Bookings API] Error updating booking:', error);
    return NextResponse.json(
      { 
        error: 'Errore nell\'aggiornamento della prenotazione',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Elimina booking (solo SuperAdmin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url);
    const userRole = url.searchParams.get('userRole');

    console.log('[Bookings API] Delete request:', { id: params.id, userRole });

    // Verifica che solo SuperAdmin possa eliminare booking
    if (userRole !== 'SuperAdmin') {
      return NextResponse.json(
        { error: 'Solo il SuperAdmin può eliminare le prenotazioni' },
        { status: 403 }
      );
    }

    await prisma.booking.delete({
      where: { id: params.id },
    });

    console.log('[Bookings API] Booking deleted successfully:', params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Bookings API] Error deleting booking:', error);
    return NextResponse.json(
      { 
        error: 'Errore nell\'eliminazione della prenotazione',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
