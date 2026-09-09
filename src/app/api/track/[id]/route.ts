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
    await db.syncFromCloud(true);

    const { id } = await params;
    const cleanId = decodeURIComponent(id).trim();

    if (!cleanId) {
      return NextResponse.json({ found: false, error: 'ID is required' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    // 1. Try match as Grievance ID directly or with padding
    let grievanceTicket = db.getGrievanceById(cleanId);
    if (!grievanceTicket && /^\d+$/.test(cleanId)) {
      grievanceTicket = db.getGrievanceById(`PDS-GRV-${cleanId.padStart(4, '0')}`);
    }
    if (grievanceTicket) {
      return NextResponse.json(
        {
          found: true,
          type: 'grievance',
          data: grievanceTicket,
          ticket: grievanceTicket,
          grievances: [grievanceTicket],
          requests: []
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    // 2. Try match as Request ID directly or with padding
    let requestTicket = db.getRequestById(cleanId);
    if (!requestTicket && /^\d+$/.test(cleanId)) {
      requestTicket = db.getRequestById(`PDS-REQ-${cleanId.padStart(4, '0')}`);
    }
    if (requestTicket) {
      return NextResponse.json(
        {
          found: true,
          type: 'request',
          data: requestTicket,
          ticket: requestTicket,
          grievances: [],
          requests: [requestTicket]
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    // 3. Try match by Phone Number
    const cleanPhone = cleanId.replace(/\D/g, '');
    if (cleanPhone.length >= 10) {
      const byPhoneGrv = db.getGrievancesByPhone(cleanPhone);
      const byPhoneReq = db.getRequestsByPhone(cleanPhone);

      if (byPhoneGrv.length > 0 || byPhoneReq.length > 0) {
        const primary = byPhoneGrv[0] || byPhoneReq[0];
        return NextResponse.json(
          {
            found: true,
            type: 'phone',
            data: primary,
            ticket: primary,
            grievances: byPhoneGrv,
            requests: byPhoneReq
          },
          { headers: NO_CACHE_HEADERS }
        );
      }
    }

    return NextResponse.json(
      { found: false, error: 'Ticket not found' },
      { status: 404, headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Track API error:', error);
    return NextResponse.json(
      { found: false, error: 'Server error' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
