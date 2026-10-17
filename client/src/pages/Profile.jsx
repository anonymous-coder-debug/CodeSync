import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layouts/DashboardLayout';
import { Mail, User, Calendar } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-lg animate-fadeInUp">
        <h1 className="font-display text-2xl font-semibold text-white">Your profile</h1>

        <div className="card mt-6 p-6">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-semibold text-bg"
              style={{ backgroundColor: user?.avatarColor || '#5EEAD4' }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-100">{user?.username}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-bg-border pt-6">
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <User size={15} className="text-accent" />
              Username: <span className="text-slate-200">{user?.username}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Mail size={15} className="text-accent" />
              Email: <span className="text-slate-200">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Calendar size={15} className="text-accent" />
              Joined: <span className="text-slate-200">{new Date(user?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
