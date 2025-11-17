'use client';

import React, { useState } from 'react';
import { Link2, Copy, Check, Home } from 'lucide-react';
import Link from 'next/link';

export default function LinkShortenerPage() {
  const [originalLink, setOriginalLink] = useState('');
  const [customText, setCustomText] = useState('');
  const [maxClicks, setMaxClicks] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    if (!originalLink) {
      alert('Please enter a link to shorten');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/shorten-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalLink,
          customText,
          maxClicks: maxClicks ? parseInt(maxClicks) : null,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        alert(data.error);
      } else {
        setShortLink(data.shortLink);
      }
    } catch (error) {
      console.error('Error shortening link:', error);
      alert('Failed to shorten link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-white hover:text-purple-400 transition-colors flex items-center gap-2">
            <Home size={20} />
            Back to Home
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-800 rounded-xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
                <Link2 size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Link Shortener</h1>
              <p className="text-gray-400">Create custom short links for easy sharing experience!</p>
            </div>

            <div className="space-y-6">
              {/* Original Link */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter Link
                </label>
                <input
                  type="url"
                  value={originalLink}
                  onChange={(e) => setOriginalLink(e.target.value)}
                  placeholder="https://example.com/very/long/url"
                  className="w-full px-4 py-4 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-lg border-2 border-slate-600 focus:border-purple-500"
                />
              </div>

              {/* Custom Text */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Text (optional)
                </label>
                <div className="flex items-center bg-slate-700 rounded-lg overflow-hidden border-2 border-slate-600 focus-within:border-purple-500">
                  <span className="px-4 text-gray-400 text-lg">short.link/</span>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                    placeholder="my-custom-link"
                    className="flex-1 px-4 py-4 bg-transparent text-white outline-none text-lg"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Leave blank for random ID
                </p>
              </div>

              {/* Max Clicks */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Clicks (leave blank for unlimited)
                </label>
                <input
                  type="number"
                  value={maxClicks}
                  onChange={(e) => setMaxClicks(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-4 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-lg border-2 border-slate-600 focus:border-purple-500"
                />
              </div>

              {/* Shorten Button */}
              <button
                onClick={handleShorten}
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold text-lg disabled:opacity-50"
              >
                {loading ? 'Shortening...' : 'Shorten Link'}
              </button>

              {/* Result */}
              {shortLink && (
                <div className="mt-8 p-6 bg-slate-700 rounded-lg border-2 border-purple-500">
                  <p className="text-sm text-gray-400 mb-2">Your shortened link:</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={shortLink}
                      readOnly
                      className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-lg text-lg font-mono"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  {maxClicks && (
                    <p className="mt-3 text-sm text-gray-400">
                      Max clicks: {maxClicks}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}