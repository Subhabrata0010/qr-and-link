import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Check cookie first
  const cachedLink = request.cookies.get(`link_${id}`)?.value;
  if (cachedLink) {
    return NextResponse.redirect(cachedLink);
  }

  const client = await clientPromise;
  const db = client.db('qr-and-link');
  const collection = db.collection('links');
  const linkData = await collection.findOne({ _id: new ObjectId(id) });

  if (!linkData) {
    return new NextResponse('Link not found', { status: 404 });
  }

  // Check if max clicks exceeded
  if (linkData.maxClicks && linkData.clicks >= linkData.maxClicks) {
    return new NextResponse('Link has reached maximum clicks', { status: 410 });
  }
  // Increment click count
  // Increment click count
  await collection.updateOne({ _id: new ObjectId(id) }, { $inc: { clicks: 1 } });
  // Set cookie for future requests
  const response = NextResponse.redirect(linkData.originalLink);
  response.cookies.set(`link_${id}`, linkData.originalLink, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return response;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const client = await clientPromise;
  const db = client.db('qr-and-link');
  const collection = db.collection('links');
  await collection.insertOne({
    _id: new ObjectId(id),
    originalLink: body.originalLink,
    clicks: 0,
    maxClicks: body.maxClicks || null,
    createdAt: new Date(),
  });

  return new NextResponse('Link created', { status: 201 });
}