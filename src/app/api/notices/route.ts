import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { VillageNotice } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await db.syncFromCloud();
    const notices = db.getNotices();
    return NextResponse.json({
      success: true,
      notices
    });
  } catch (error) {
    console.error('Error fetching notices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve notices' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await db.syncFromCloud(true);
    const body = await request.json();

    if (!body.title?.ta && !body.title?.en) {
      return NextResponse.json(
        { success: false, error: 'Notice title is required' },
        { status: 400 }
      );
    }

    const newNotice: Omit<VillageNotice, 'id'> = {
      title: {
        ta: body.title?.ta || body.title?.en || '',
        en: body.title?.en || body.title?.ta || ''
      },
      content: {
        ta: body.content?.ta || body.content?.en || '',
        en: body.content?.en || body.content?.ta || ''
      },
      date: body.date || new Date().toISOString().split('T')[0],
      expiryDate: body.expiryDate || undefined,
      category: body.category || 'panchayat',
      important: Boolean(body.important),
      source: body.source || 'நால்ரோடு மக்கள் இ-சேவை மையம் (Nalroad e-Seva)'
    };

    const created = db.addNotice(newNotice);
    await db.persistToCloud();

    return NextResponse.json({
      success: true,
      notice: created,
      message: 'அறிவிப்பு வெற்றிகரமாக வெளியிடப்பட்டது (Notice published successfully)'
    });
  } catch (error) {
    console.error('Error creating notice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create notice' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await db.syncFromCloud(true);
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch {
        // No body
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Notice ID is required' },
        { status: 400 }
      );
    }

    const success = db.deleteNotice(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Notice not found or already removed' },
        { status: 404 }
      );
    }

    await db.persistToCloud();

    return NextResponse.json({
      success: true,
      message: 'அறிவிப்பு நீக்கப்பட்டது (Notice deleted)'
    });
  } catch (error) {
    console.error('Error deleting notice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete notice' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await db.syncFromCloud(true);
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Notice ID is required' },
        { status: 400 }
      );
    }

    const updated = db.updateNotice(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Notice not found' },
        { status: 404 }
      );
    }

    await db.persistToCloud();

    return NextResponse.json({
      success: true,
      notice: updated,
      message: 'அறிவிப்பு புதுப்பிக்கப்பட்டது (Notice updated)'
    });
  } catch (error) {
    console.error('Error updating notice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notice' },
      { status: 500 }
    );
  }
}
