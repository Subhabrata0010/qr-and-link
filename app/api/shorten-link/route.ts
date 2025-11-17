import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (use database in production)
const linkStore = new Map<string, {
  originalLink: string;
  clicks: number;
  maxClicks: number | null;
  createdAt: Date;
}>();

function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 8);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { originalLink, customText, maxClicks } = body;

    if (!originalLink) {
      return NextResponse.json(
        { error: 'Original link is required' },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(originalLink);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Generate or use custom ID
    const linkId = customText || generateRandomId();

    // Check if custom ID already exists
    if (customText && linkStore.has(customText)) {
      return NextResponse.json(
        { error: 'This custom ID is already taken' },
        { status: 409 }
      );
    }

    // Store the link
    linkStore.set(linkId, {
      originalLink,
      clicks: 0,
      maxClicks: maxClicks || null,
      createdAt: new Date(),
    });

    const shortLink = `${process.env.NEXT_PUBLIC_BASE_URL}/${linkId}`;

    return NextResponse.json({
      shortLink,
      linkId,
      success: true,
    });

  } catch (error) {
    console.error('Shorten link error:', error);
    return NextResponse.json(
      { error: 'Failed to shorten link' },
      { status: 500 }
    );
  }
}
