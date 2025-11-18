import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Link not found</p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-all inline-block"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
