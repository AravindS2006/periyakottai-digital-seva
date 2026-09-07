import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { pin, password } = await request.json();

    // Secure PIN or Password matching
    // Default PIN: 624614 or Murugesan's mobile: 9790382437 or admin2026
    const validCredentials =
      pin === '624614' ||
      pin === '9790382437' ||
      password === 'admin2026' ||
      password === 'pds624614';

    if (!validCredentials) {
      return NextResponse.json(
        { error: 'Invalid PIN or password' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      operator: {
        name: 'Murugesan K',
        centre: 'Nalroad Makkal e-Seva Maiyam',
        role: 'Centre Operator & Administrator'
      }
    });

    // Set secure auth cookie
    response.cookies.set('pds_admin_session', 'authenticated_murugesan', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
