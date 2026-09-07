import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || body.ticketId;
    const type = body.type || 'request';
    const status = body.status;
    const note = body.note;
    const author = body.author || 'Murugesan K';

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and Status are required' }, { status: 400 });
    }

    if (type === 'request') {
      const updated = db.updateRequestStatus(id, status, note || `Status updated to ${status}`, author);
      if (!updated) {
        return NextResponse.json({ error: 'Request ticket not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, ticket: updated });
    } else if (type === 'grievance') {
      const updated = db.updateGrievanceStatus(id, status, note || `Status updated to ${status}`, author);
      if (!updated) {
        return NextResponse.json({ error: 'Grievance ticket not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, grievance: updated });
    }

    return NextResponse.json({ error: 'Invalid ticket type' }, { status: 400 });
  } catch (error) {
    console.error('Update status API error:', error);
    return NextResponse.json({ error: 'Failed to update ticket status' }, { status: 500 });
  }
}
