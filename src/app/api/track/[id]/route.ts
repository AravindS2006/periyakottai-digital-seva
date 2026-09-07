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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cleanId = decodeURIComponent(id).trim();

    if (!cleanId) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    // 1. Try match as Request ID
    const requestTicket = db.getRequestById(cleanId);
    if (requestTicket) {
      return NextResponse.json({ type: 'request', data: requestTicket }, { headers: NO_CACHE_HEADERS });
    }

    // 2. Try match as Grievance ID
    const grievanceTicket = db.getGrievanceById(cleanId);
    if (grievanceTicket) {
      return NextResponse.json({ type: 'grievance', data: grievanceTicket }, { headers: NO_CACHE_HEADERS });
    }

    // 3. Try match by Phone Number
    const cleanPhone = cleanId.replace(/\D/g, '');
    if (cleanPhone.length >= 10) {
      const byPhone = db.getRequestsByPhone(cleanPhone);
      if (byPhone.length > 0) {
        return NextResponse.json({ type: 'request', data: byPhone[0] }, { headers: NO_CACHE_HEADERS });
      }
      const byPhoneGrv = db.getGrievancesByPhone(cleanPhone);
      if (byPhoneGrv.length > 0) {
        return NextResponse.json({ type: 'grievance', data: byPhoneGrv[0] }, { headers: NO_CACHE_HEADERS });
      }
    }

    return NextResponse.json({ error: 'Ticket not found' }, { status: 404, headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Track API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
