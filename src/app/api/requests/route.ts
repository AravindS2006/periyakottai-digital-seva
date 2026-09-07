import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    await db.syncFromCloud();
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (phone) {
      const tickets = db.getRequestsByPhone(phone);
      return NextResponse.json(tickets);
    }

    const allRequests = db.getRequests();
    return NextResponse.json(allRequests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.citizenName || !body.phoneNumber) {
      return NextResponse.json(
        { error: 'Citizen name and phone number are required' },
        { status: 400 }
      );
    }

    const newTicket = db.createRequest({
      citizenName: body.citizenName,
      phoneNumber: body.phoneNumber,
      village: body.village || 'பெரியாக்கோட்டை',
      serviceId: body.serviceId || 'general_assistance',
      serviceName: body.serviceName || 'பொது உதவி',
      description: body.description || '',
      priority: body.priority || 'Normal',
      status: 'Submitted',
      assignedTo: 'முருகேசன் கே (Murugesan K)'
    });

    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}
