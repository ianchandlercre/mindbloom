import { NextRequest, NextResponse } from 'next/server';
import { saveSurveyResponses, updateProfile, hasSurveyCompleted } from '@/lib/db';
import { calculateProfile } from '@/lib/profile-calculator';

export async function POST(request: NextRequest) {
  try {
    const { userId, responses } = await request.json();

    if (!userId || !responses || !Array.isArray(responses)) {
      return NextResponse.json({ error: 'userId and responses required' }, { status: 400 });
    }

    // Save survey responses
    await saveSurveyResponses(userId, responses);

    // Calculate profile from responses
    const { dimensions, interests, difficultyLevel } = calculateProfile(responses);

    // Update user profile
    await updateProfile(userId, dimensions, interests, difficultyLevel);

    return NextResponse.json({
      success: true,
      profile: { dimensions, interests, difficultyLevel },
    });
  } catch (e) {
    console.error('Survey error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId') || '0');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const completed = await hasSurveyCompleted(userId);
    return NextResponse.json({ completed });
  } catch (e) {
    console.error('Survey GET error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
