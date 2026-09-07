import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    await db.syncFromCloud();
    const grievances = db.getGrievances();
    return NextResponse.json(grievances);
  } catch (error) {
    console.error('Error fetching grievances:', error);
    return NextResponse.json({ error: 'Failed to fetch grievances' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.citizenName || !body.phoneNumber || !body.description) {
      return NextResponse.json(
        { error: 'Name, phone number and description are required' },
        { status: 400 }
      );
    }

    const newGrievance = db.createGrievance({
      citizenName: body.citizenName,
      phoneNumber: body.phoneNumber,
      village: body.village || 'பெரியாக்கோட்டை',
      location: body.location || 'பெரியாக்கோட்டை',
      category: body.category || 'other',
      description: body.description,
      status: 'Received'
    });

    return NextResponse.json(newGrievance, { status: 201 });
  } catch (error) {
    console.error('Error creating grievance:', error);
    return NextResponse.json({ error: 'Failed to create grievance' }, { status: 500 });
  }
}
