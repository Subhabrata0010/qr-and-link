import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const client = await clientPromise;
    const db = client.db('qr-and-link');
    const collection = db.collection('links');
    const linkData = await collection.findOne({ _id: new ObjectId(id) });

    if (!linkData) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    // Check if max clicks exceeded
    if (linkData.maxClicks && linkData.clicks >= linkData.maxClicks) {
      return NextResponse.json(
        { error: 'Link has reached maximum clicks' },
        { status: 410 }
      );
    }
    // Increment click count
    // Increment click count
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { clicks: 1 } }
    );
    return NextResponse.json({
      originalLink: linkData.originalLink,
      clicks: linkData.clicks + 1,
    });

  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}