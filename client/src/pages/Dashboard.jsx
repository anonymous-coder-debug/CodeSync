import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, LogIn, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import RoomCard from '../components/RoomCard';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';
import { getMyRooms } from '../services/roomService';
import { getErrorMessage } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyRooms()
      .then((res) => setRooms(res.data.rooms))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="animate-fadeInUp">
        <h1 className="font-display text-2xl font-semibold text-white">
          Welcome back, {user?.username} 👋
        </h1>
        <p className="mt-1 text-slate-500">Jump into an existing room or start a new one.</p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={() => navigate('/create-room')}
            className="card group flex items-center gap-4 p-6 text-left transition hover:border-accent/50 hover:shadow-glow"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <PlusCircle size={22} />
            </div>
            <div>
              <p className="font-semibold text-slate-100">Create a room</p>
              <p className="text-sm text-slate-500">Start a fresh coding session</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/join-room')}
            className="card group flex items-center gap-4 p-6 text-left transition hover:border-accent/50 hover:shadow-glow"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-violet/10 text-violet">
              <LogIn size={22} />
            </div>
            <div>
              <p className="font-semibold text-slate-100">Join a room</p>
              <p className="text-sm text-slate-500">Enter a room ID from a teammate</p>
            </div>
          </button>
        </div>

        <div className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <FolderOpen size={18} className="text-slate-500" />
            <h2 className="font-semibold text-slate-200">Recent rooms</h2>
          </div>

          {loading ? (
            <Loader label="Loading your rooms..." />
          ) : rooms.length === 0 ? (
            <div className="card flex flex-col items-center justify-center gap-2 py-14 text-center">
              <p className="text-slate-400">You haven't joined any rooms yet.</p>
              <p className="text-sm text-slate-600">Create one to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard key={room.roomId} room={room} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
