import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store'
};

export async function GET(request: Request) {
  try {
    await db.syncFromCloud();
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (phone) {
      const tickets = db.getRequestsByPhone(phone);
      return NextResponse.json(tickets, { headers: NO_CACHE_HEADERS });
    }

    const allRequests = db.getRequests();
    return NextResponse.json(allRequests, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.citizenName || !body.phoneNumber) {
      return NextResponse.json(
        { error: 'Citizen name and phone number are required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const newTicket = db.createRequest({
      citizenName: body.citizenName,
      phoneNumber: body.phoneNumber,
      village: body.village || 'பெரியகோட்டை',
      serviceId: body.serviceId || 'general_assistance',
      serviceName: body.serviceName || 'பொது உதவி',
      description: body.description || '',
      priority: body.priority || 'Normal',
      status: 'Submitted',
      assignedTo: 'முருகேசன் கு (Murugesan K)'
    });

    return NextResponse.json(newTicket, { status: 201, headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
