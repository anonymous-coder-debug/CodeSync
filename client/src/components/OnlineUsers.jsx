import { Users } from 'lucide-react';

export default function OnlineUsers({ users = [] }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-bg-border px-4 py-3">
        <Users size={16} className="text-accent" />
        <h3 className="text-sm font-semibold text-slate-200">Online ({users.length})</h3>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto px-2 py-2">
        {users.length === 0 && (
          <p className="px-2 py-4 text-center text-xs text-slate-600">No one else is here yet.</p>
        )}
        {users.map((u, idx) => (
          <div key={`${u.userId || u.username}-${idx}`} className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-bg-soft">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulseSoft rounded-full bg-green-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-bg"
              style={{ backgroundColor: u.avatarColor || '#5EEAD4' }}
            >
              {(u.username || '?').charAt(0).toUpperCase()}
            </div>
            <span className="truncate text-sm text-slate-300">{u.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
