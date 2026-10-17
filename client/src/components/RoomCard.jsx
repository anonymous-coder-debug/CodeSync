import { Link } from 'react-router-dom';
import { Code2, Users, ArrowUpRight } from 'lucide-react';
import { LANGUAGES } from '../utils/languageConfig';

export default function RoomCard({ room }) {
  const langLabel = LANGUAGES[room.language]?.label || room.language;

  return (
    <Link
      to={`/room/${room.roomId}`}
      className="card group flex flex-col gap-3 p-4 transition hover:border-accent/50 hover:shadow-glow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-slate-100">{room.name}</p>
          <p className="mt-0.5 font-mono text-xs text-slate-500">#{room.roomId}</p>
        </div>
        <ArrowUpRight size={16} className="text-slate-600 transition group-hover:text-accent" />
      </div>

      <div className="mt-auto flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Code2 size={13} /> {langLabel}
        </span>
        <span className="flex items-center gap-1">
          <Users size={13} /> {room.memberCount ?? 0}
        </span>
      </div>
    </Link>
  );
}
