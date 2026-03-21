import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getLatestAIAnalysis } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, feedback, userId } = await request.json();

    if (!sessionId || !feedback) {
      return NextResponse.json({ error: 'sessionId and feedback required' }, { status: 400 });
    }

    await sql`UPDATE game_sessions SET feedback = ${JSON.stringify(feedback)} WHERE id = ${sessionId}`;

    if (userId) {
      const aiAnalysis = await getLatestAIAnalysis(userId);
      if (aiAnalysis) {
        return NextResponse.json({
          success: true,
          aiEncouragement: aiAnalysis.encouragement || null,
          aiInsights: aiAnalysis.insights || null,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Feedback error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
