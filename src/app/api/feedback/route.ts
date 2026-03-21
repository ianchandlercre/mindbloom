import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, feedback } = await request.json();

    if (!sessionId || !feedback) {
      return NextResponse.json({ error: 'sessionId and feedback required' }, { status: 400 });
    }

    const db = await getDb();
    db.run('UPDATE game_sessions SET feedback = ? WHERE id = ?',
      [JSON.stringify(feedback), sessionId]);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Feedback error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
