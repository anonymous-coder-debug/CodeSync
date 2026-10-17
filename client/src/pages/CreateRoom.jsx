import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, Sparkles } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { LANGUAGE_LIST } from '../utils/languageConfig';
import { createRoom } from '../services/roomService';
import { getErrorMessage } from '../services/api';

export default function CreateRoom() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createRoom({ name: name.trim() || undefined, language });
      toast.success(`Room ${res.data.room.roomId} created!`);
      navigate(`/room/${res.data.room.roomId}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-lg animate-fadeInUp">
        <div className="mb-6 flex items-center gap-2 text-accent">
          <Sparkles size={18} />
          <h1 className="font-display text-2xl font-semibold text-white">Create a room</h1>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5 p-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Room name (optional)</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              placeholder="e.g. Backend interview prep"
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Language</label>
            <div className="grid grid-cols-2 gap-3">
              {LANGUAGE_LIST.map((lang) => (
                <button
                  type="button"
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                    language === lang.id
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-bg-border bg-bg-soft text-slate-400 hover:border-accent/30'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? 'Creating room...' : 'Create room'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
