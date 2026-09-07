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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || body.ticketId;
    const type = body.type || 'request';
    const status = body.status;
    const note = body.note;
    const author = body.author || 'Murugesan K (Operator)';

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and Status are required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    if (type === 'request') {
      const updated = db.updateRequestStatus(id, status, note || `Status updated to ${status}`, author);
      if (!updated) {
        return NextResponse.json(
          { error: 'Request ticket not found' },
          { status: 404, headers: NO_CACHE_HEADERS }
        );
      }
      return NextResponse.json({ success: true, ticket: updated }, { headers: NO_CACHE_HEADERS });
    } else if (type === 'grievance') {
      const updated = db.updateGrievanceStatus(id, status, note || `Status updated to ${status}`, author);
      if (!updated) {
        return NextResponse.json(
          { error: 'Grievance ticket not found' },
          { status: 404, headers: NO_CACHE_HEADERS }
        );
      }
      return NextResponse.json({ success: true, grievance: updated }, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json(
      { error: 'Invalid ticket type' },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Update status API error:', error);
    return NextResponse.json(
      { error: 'Failed to update ticket status' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
