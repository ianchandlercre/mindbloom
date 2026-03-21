import { NextRequest, NextResponse } from 'next/server';
import { getProfile } from '@/lib/db';
import { getLatestUserImage, saveGeneratedImage } from '@/lib/db';
import { generateDashboardImage } from '@/lib/ai-service';

/**
 * GET /api/images?userId=X&purpose=dashboard
 * Returns the latest generated image for the user, or null.
 *
 * POST /api/images
 * { userId, purpose, regenerate? }
 * Generates a new image via Replicate and stores the URL.
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId') || '0');
    const purpose = searchParams.get('purpose') || 'dashboard';

    if (!userId) {
      return NextResponse.json({ imageUrl: null });
    }

    const existing = await getLatestUserImage(userId, purpose);
    if (existing) {
      return NextResponse.json({ imageUrl: existing.image_url, cached: true });
    }

    return NextResponse.json({ imageUrl: null });
  } catch (e) {
    console.error('Images GET error:', e);
    return NextResponse.json({ imageUrl: null });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, purpose = 'dashboard', regenerate = false } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // Check for existing image unless regenerate requested
    if (!regenerate) {
      const existing = await getLatestUserImage(userId, purpose);
      if (existing) {
        return NextResponse.json({ imageUrl: existing.image_url, cached: true });
      }
    }

    // Get user profile for image generation
    const profile = await getProfile(userId);
    if (!profile) {
      return NextResponse.json({ imageUrl: null });
    }

    // Generate new image via Replicate
    const imageUrl = await generateDashboardImage(profile.interests, userId);
    if (!imageUrl) {
      return NextResponse.json({ imageUrl: null, message: 'Replicate not configured or generation failed' });
    }

    // Store in DB
    const topInterest = profile.interests[0] || 'general';
    await saveGeneratedImage(userId, imageUrl, `Dashboard illustration for ${topInterest}`, topInterest, purpose);

    return NextResponse.json({ imageUrl, cached: false });
  } catch (e) {
    console.error('Images POST error:', e);
    return NextResponse.json({ imageUrl: null });
  }
}
