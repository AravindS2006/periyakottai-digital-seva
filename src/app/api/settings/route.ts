import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PlatformSettings } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = db.getSettings();
    return NextResponse.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { settings, actor } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Valid settings object is required' },
        { status: 400 }
      );
    }

    const updated = db.updateSettings(settings as Partial<PlatformSettings>, actor || 'Murugesan K');

    return NextResponse.json({
      success: true,
      settings: updated,
      message: 'அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன (Settings updated successfully)'
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return PUT(request);
}
