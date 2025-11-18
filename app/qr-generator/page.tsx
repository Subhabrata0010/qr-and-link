/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, QrCode, Download, X, Check, Home } from 'lucide-react';
import Link from 'next/link';

export default function QRGeneratorPage() {
  const [mounted, setMounted] = useState(false);
  const [qrText, setQrText] = useState('');
  const [qrColorType, setQrColorType] = useState<'solid' | 'gradient'>('solid');
  const [qrColor, setQrColor] = useState('#000000');
  const [gradStartColor, setGradStartColor] = useState('#000000');
  const [gradEndColor, setGradEndColor] = useState('#ff0000');
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [bgColorType, setBgColorType] = useState<'solid' | 'gradient'>('solid');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgGradStart, setBgGradStart] = useState('#ffffff');
  const [bgGradEnd, setBgGradEnd] = useState('#cccccc');
  const [qrSize, setQrSize] = useState('300');
  const [dotStyle, setDotStyle] = useState('square');
  const [cornerSquareStyle, setCornerSquareStyle] = useState('square');
  const [cornerDotStyle, setCornerDotStyle] = useState('square');
  const [downloadFormat, setDownloadFormat] = useState('png');
  const [iconUrl, setIconUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrCodeRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Client-side Cloudinary upload
  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_UPLOAD_PRESET!);
      formData.append('folder', process.env.NEXT_PUBLIC_CLOUD_FOLDER!);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDNAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      setIconUrl(data.secure_url);
      setUploading(false);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
      alert('Failed to upload icon');
    }
  };

  const generateQR = async () => {
    if (!qrText) {
      alert('Please enter text for QR code');
      return;
    }

    if (!mounted) return;

    const QRCodeStyling = (await import('qr-code-styling')).default;

    const options: any = {
      width: parseInt(qrSize),
      height: parseInt(qrSize),
      data: qrText,
      image: iconUrl || undefined,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'H'
      },
      dotsOptions: {
        type: dotStyle,
        gradient: qrColorType === 'gradient' ? {
          type: gradientType,
          colorStops: [
            { offset: 0, color: gradStartColor },
            { offset: 1, color: gradEndColor }
          ]
        } : undefined,
        color: qrColorType === 'solid' ? qrColor : undefined
      },
      cornersSquareOptions: {
        type: cornerSquareStyle,
        color: gradStartColor
      },
      cornersDotOptions: {
        type: cornerDotStyle,
        color: gradEndColor
      },
      backgroundOptions: {
        gradient: bgColorType === 'gradient' ? {
          type: gradientType,
          colorStops: [
            { offset: 0, color: bgGradStart },
            { offset: 1, color: bgGradEnd }
          ]
        } : undefined,
        color: bgColorType === 'solid' ? bgColor : undefined
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 10
      }
    };

    const container = document.getElementById('qrcode-container');
    if (!container) return;

    // Properly clean up existing QR code
    if (qrCodeRef.current) {
      try {
        // Remove all child nodes properly
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        qrCodeRef.current = null;
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    }

    // Create new QR code
    qrCodeRef.current = new QRCodeStyling(options);
    qrCodeRef.current.append(container);

    setGenerated(true);
  };

  const downloadQR = () => {
    if (!generated || !qrCodeRef.current) {
      alert('Please generate a QR code first!');
      return;
    }
    qrCodeRef.current.download({ name: 'qr_code', extension: downloadFormat });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-white hover:text-purple-400 transition-colors flex items-center gap-2">
            <Home size={20} />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">QR Code Generator</h1>
          <p className="text-purple-200">Create beautiful, customized QR codes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-2xl max-h-[calc(100vh-200px)] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
            
            <div className="space-y-6">
              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  QR Code Content *
                </label>
                <input
                  type="text"
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  placeholder="Enter text or URL"
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              {/* Icon Upload - OPTIONAL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Center Icon (Optional)
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Upload size={20} />
                    {uploading ? 'Uploading...' : 'Upload Icon'}
                  </button>
                  {iconUrl && (
                    <button
                      onClick={() => setIconUrl('')}
                      className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleIconUpload}
                  className="hidden"
                />
                {iconUrl && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-green-400">
                    <Check size={16} />
                    Icon uploaded successfully
                  </div>
                )}
              </div>

              {/* QR Color Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  QR Code Color Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      checked={qrColorType === 'solid'}
                      onChange={() => setQrColorType('solid')}
                      className="w-4 h-4"
                    />
                    Solid
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      checked={qrColorType === 'gradient'}
                      onChange={() => setQrColorType('gradient')}
                      className="w-4 h-4"
                    />
                    Gradient
                  </label>
                </div>
              </div>

              {/* Colors */}
              {qrColorType === 'solid' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    QR Code Color
                  </label>
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-full h-12 rounded-lg cursor-pointer"
                  />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Gradient Start
                      </label>
                      <input
                        type="color"
                        value={gradStartColor}
                        onChange={(e) => setGradStartColor(e.target.value)}
                        className="w-full h-12 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Gradient End
                      </label>
                      <input
                        type="color"
                        value={gradEndColor}
                        onChange={(e) => setGradEndColor(e.target.value)}
                        className="w-full h-12 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Gradient Type
                    </label>
                    <select
                      value={gradientType}
                      onChange={(e) => setGradientType(e.target.value as 'linear' | 'radial')}
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      <option value="linear">Linear</option>
                      <option value="radial">Radial</option>
                    </select>
                  </div>
                </>
              )}

              {/* Background Color Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Background Color Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      checked={bgColorType === 'solid'}
                      onChange={() => setBgColorType('solid')}
                      className="w-4 h-4"
                    />
                    Solid
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      checked={bgColorType === 'gradient'}
                      onChange={() => setBgColorType('gradient')}
                      className="w-4 h-4"
                    />
                    Gradient
                  </label>
                </div>
              </div>

              {/* Background Colors */}
              {bgColorType === 'solid' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full h-12 rounded-lg cursor-pointer"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      BG Start
                    </label>
                    <input
                      type="color"
                      value={bgGradStart}
                      onChange={(e) => setBgGradStart(e.target.value)}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      BG End
                    </label>
                    <input
                      type="color"
                      value={bgGradEnd}
                      onChange={(e) => setBgGradEnd(e.target.value)}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* QR Size */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  QR Code Size
                </label>
                <select
                  value={qrSize}
                  onChange={(e) => setQrSize(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="200">Small (200x200)</option>
                  <option value="300">Medium (300x300)</option>
                  <option value="400">Large (400x400)</option>
                </select>
              </div>

              {/* Styles */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Dot Style
                  </label>
                  <select
                    value={dotStyle}
                    onChange={(e) => setDotStyle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg text-sm"
                  >
                    <option value="square">Square</option>
                    <option value="rounded">Rounded</option>
                    <option value="dots">Dots</option>
                    <option value="classy">Classy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Corner Sq
                  </label>
                  <select
                    value={cornerSquareStyle}
                    onChange={(e) => setCornerSquareStyle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg text-sm"
                  >
                    <option value="square">Square</option>
                    <option value="extra-rounded">Rounded</option>
                    <option value="dot">Dot</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Corner Dot
                  </label>
                  <select
                    value={cornerDotStyle}
                    onChange={(e) => setCornerDotStyle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg text-sm"
                  >
                    <option value="square">Square</option>
                    <option value="dot">Dot</option>
                  </select>
                </div>
              </div>

              <button
                onClick={generateQR}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold text-lg"
              >
                Generate QR Code
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Preview</h2>
            
            <div className="bg-slate-700 rounded-xl p-8 mb-6 flex items-center justify-center min-h-[400px]">
              <div id="qrcode-container">
                {!generated && (
                  <div className="text-center text-gray-400">
                    <QrCode size={80} className="mx-auto mb-4 opacity-50" />
                    <p>Generate a QR code to see preview</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Download Format
                </label>
                <select
                  value={downloadFormat}
                  onChange={(e) => setDownloadFormat(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                  <option value="svg">SVG</option>
                  <option value="webp">WEBP</option>
                </select>
              </div>

              <button
                onClick={downloadQR}
                disabled={!generated}
                className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={20} />
                Download QR Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}