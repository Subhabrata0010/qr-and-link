'use client';

import Link from 'next/link';
import { QrCode, Link2, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">QR Tools Suite</h1>
          <p className="text-xl text-purple-200">Professional QR code generation & link shortening</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* QR Generator Card */}
          <Link href="/qr-generator">
            <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-purple-500">
              <div className="flex items-center justify-center w-20 h-20 bg-purple-600 rounded-full mb-6 mx-auto">
                <QrCode size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white text-center mb-4">QR Generator</h2>
              <p className="text-gray-300 text-center mb-6">
                Create customized QR codes with gradients, custom icons, and multiple export formats
              </p>
              <div className="flex items-center justify-center text-purple-400 font-semibold">
                Get Started <ArrowRight className="ml-2" size={20} />
              </div>
            </div>
          </Link>

          {/* Link Shortener Card */}
          <Link href="/link-shortener">
            <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-purple-500">
              <div className="flex items-center justify-center w-20 h-20 bg-pink-600 rounded-full mb-6 mx-auto">
                <Link2 size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white text-center mb-4">Link Shortener</h2>
              <p className="text-gray-300 text-center mb-6">
                Create custom short links with click tracking and custom IDs for easy sharing
              </p>
              <div className="flex items-center justify-center text-pink-400 font-semibold">
                Get Started <ArrowRight className="ml-2" size={20} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}