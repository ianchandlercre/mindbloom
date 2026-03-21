import { NextRequest, NextResponse } from 'next/server';
import { createUser, authenticateUser } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, pin, action } = await request.json();

    if (!name || !pin) {
      return NextResponse.json({ error: 'Name and PIN are required' }, { status: 400 });
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return NextResponse.json({ error: 'PIN must be exactly 4 digits' }, { status: 400 });
    }

    if (action === 'register') {
      try {
        const user = await createUser(name.trim(), pin);
        return NextResponse.json({ user });
      } catch (e: any) {
        if (e.message?.includes('UNIQUE') || e.message?.includes('unique') || e.code === '23505') {
          return NextResponse.json({ error: 'That name is already taken' }, { status: 400 });
        }
        throw e;
      }
    }

    if (action === 'login') {
      const user = await authenticateUser(name.trim(), pin);
      if (!user) {
        return NextResponse.json({ error: 'Name or PIN is incorrect' }, { status: 401 });
      }
      return NextResponse.json({ user });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (e) {
    console.error('Auth error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
