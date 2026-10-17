import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, LogIn } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { joinRoom } from '../services/roomService';
import { getErrorMessage } from '../services/api';

export default function JoinRoom() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomId.trim()) return;
    setSubmitting(true);
    try {
      await joinRoom(roomId.trim());
      navigate(`/room/${roomId.trim().toUpperCase()}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-lg animate-fadeInUp">
        <div className="mb-6 flex items-center gap-2 text-violet">
          <LogIn size={18} />
          <h1 className="font-display text-2xl font-semibold text-white">Join a room</h1>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5 p-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Room ID</label>
            <input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="e.g. 8F2K1Q9R"
              className="input-field font-mono tracking-widest"
              autoFocus
            />
            <p className="mt-1.5 text-xs text-slate-600">Ask the room owner for their unique room ID.</p>
          </div>

          <button type="submit" disabled={submitting || !roomId.trim()} className="btn-primary w-full">
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? 'Joining room...' : 'Join room'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
