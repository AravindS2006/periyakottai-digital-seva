import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cleanId = decodeURIComponent(id).trim();

    if (!cleanId) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // 1. Try match as Request ID
    const requestTicket = db.getRequestById(cleanId);
    if (requestTicket) {
      return NextResponse.json({ type: 'request', data: requestTicket });
    }

    // 2. Try match as Grievance ID
    const grievanceTicket = db.getGrievanceById(cleanId);
    if (grievanceTicket) {
      return NextResponse.json({ type: 'grievance', data: grievanceTicket });
    }

    // 3. Try match by Phone Number
    const cleanPhone = cleanId.replace(/\D/g, '');
    if (cleanPhone.length >= 10) {
      const byPhone = db.getRequestsByPhone(cleanPhone);
      if (byPhone.length > 0) {
        return NextResponse.json({ type: 'request', data: byPhone[0] });
      }
    }

    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  } catch (error) {
    console.error('Track API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
