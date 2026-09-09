import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { GrievanceTicket } from '@/types';

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
      const tickets = db.getGrievancesByPhone(phone);
      return NextResponse.json(tickets, { headers: NO_CACHE_HEADERS });
    }

    const grievances = db.getGrievances();
    return NextResponse.json(grievances, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error fetching grievances:', error);
    return NextResponse.json({ error: 'Failed to fetch grievances' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    await db.syncFromCloud(true);
    const body = await request.json();

    if (!body.citizenName || !body.phoneNumber || !body.description) {
      return NextResponse.json(
        { error: 'Name, phone number and description are required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const newGrievance = db.createGrievance({
      citizenName: body.citizenName,
      phoneNumber: body.phoneNumber,
      village: body.village || 'பெரியகோட்டை',
      location: body.location || 'பெரியகோட்டை',
      category: body.category || 'other',
      description: body.description,
      status: 'Received'
    });

    await db.persistToCloud();

    return NextResponse.json(newGrievance, { status: 201, headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error creating grievance:', error);
    return NextResponse.json({ error: 'Failed to create grievance' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function PUT(request: Request) {
  try {
    await db.syncFromCloud(true);
    const body = await request.json();
    const id = body.id || body.ticketId;
    const status = body.status as GrievanceTicket['status'];
    const note = body.note || `Status updated to ${status}`;
    const author = body.author || 'Murugesan K (Operator)';

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and Status are required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const updated = db.updateGrievanceStatus(id, status, note, author);
    if (!updated) {
      return NextResponse.json(
        { error: 'Grievance ticket not found' },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    await db.persistToCloud();

    return NextResponse.json({ success: true, grievance: updated }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error updating grievance:', error);
    return NextResponse.json({ error: 'Failed to update grievance' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
