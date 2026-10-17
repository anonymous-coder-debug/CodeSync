import { Link, useNavigate } from 'react-router-dom';
import { Code2, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-bg-border/60 bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-white">
          <Code2 className="text-accent" size={22} />
          Code<span className="text-accent">Sync</span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="hidden items-center gap-1.5 text-sm font-medium text-slate-300 transition hover:text-accent sm:flex"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <span className="hidden text-sm text-slate-500 md:inline">
                Hi, <span className="text-slate-200">{user?.username}</span>
              </span>
              <button onClick={handleLogout} className="btn-secondary !px-4 !py-2 text-sm">
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-300 transition hover:text-accent">
                Log in
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2 text-sm">
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
