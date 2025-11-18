/* eslint-disable react-hooks/error-boundaries */
import { redirect, notFound } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RedirectPage({ params }: PageProps) {
  const { id } = await params;

  // Check cookie first
  const cookieStore = await cookies();
  const cachedLink = cookieStore.get(`link_${id}`)?.value;
  
  if (cachedLink) {
    redirect(cachedLink);
  }

  try {
    const client = await clientPromise;
    const db = client.db('qr-and-link');
    const collection = db.collection('links');
    const linkData = await collection.findOne({ _id: new ObjectId(id) });

    if (!linkData) {
      notFound();
    }

    // Check if max clicks exceeded
    if (linkData.maxClicks && linkData.clicks >= linkData.maxClicks) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Link Expired</h1>
            <p>This link has reached its maximum number of clicks.</p>
          </div>
        </div>
      );
    }

    // Increment click count
    await collection.updateOne({ _id: new ObjectId(id) }, { $inc: { clicks: 1 } });

    // Set cookie for future requests
    cookieStore.set(`link_${id}`, linkData.originalLink, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Redirect to original URL
    redirect(linkData.originalLink);
  } catch (error) {
    console.error('Redirect error:', error);
    notFound();
  }
}