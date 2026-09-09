import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PlatformSettings } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store'
};

export async function GET() {
  try {
    await db.syncFromCloud();
    const settings = db.getSettings();
    return NextResponse.json(
      {
        success: true,
        settings
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve settings' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await db.syncFromCloud(true);
    const body = await request.json();
    const { settings, actor } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Valid settings object is required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const updated = db.updateSettings(settings as Partial<PlatformSettings>, actor || 'Murugesan K');
    await db.persistToCloud();

    return NextResponse.json(
      {
        success: true,
        settings: updated,
        message: 'அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன (Settings updated successfully)'
      },
      { headers: NO_CACHE_HEADERS }
    );
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
