import { Link } from 'react-router-dom';
import { Code2 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
      <Code2 className="mb-4 text-accent" size={40} />
      <h1 className="font-display text-6xl font-bold text-white">404</h1>
      <p className="mt-3 text-slate-400">This page doesn't exist — maybe it moved rooms.</p>
      <Link to="/" className="btn-primary mt-8 px-6 py-3">
        Back to home
      </Link>
    </div>
  );
}
