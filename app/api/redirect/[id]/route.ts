import { NextRequest, NextResponse } from 'next/server';

// This would connect to your database
const linkStore = new Map<string, {
  originalLink: string;
  clicks: number;
  maxClicks: number | null;
  createdAt: Date;
}>();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const linkData = linkStore.get(id);

  if (!linkData) {
    return new NextResponse('Link not found', { status: 404 });
  }

  // Check if max clicks exceeded
  if (linkData.maxClicks && linkData.clicks >= linkData.maxClicks) {
    return new NextResponse('Link has reached maximum clicks', { status: 410 });
  }

  // Increment click count
  linkData.clicks++;
  linkStore.set(id, linkData);

  // Redirect to original URL
  return NextResponse.redirect(linkData.originalLink);
}