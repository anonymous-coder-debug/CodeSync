import { useEffect, useRef, useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';

export default function ChatPanel({ messages = [], systemLog = [], onSend, currentUsername }) {
  const [draft, setDraft] = useState('');
  const bottomRef = useRef(null);

  // Merge chat messages + join/leave notifications into one chronological feed
  const feed = [...messages.map((m) => ({ ...m, kind: 'message' })), ...systemLog.map((s) => ({ ...s, kind: 'system' }))].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [feed.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onSend(draft.trim());
    setDraft('');
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-bg-border px-4 py-3">
        <MessageSquare size={16} className="text-accent" />
        <h3 className="text-sm font-semibold text-slate-200">Room chat</h3>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {feed.length === 0 && (
          <p className="mt-6 text-center text-xs text-slate-600">No messages yet. Say hello!</p>
        )}

        {feed.map((item, idx) =>
          item.kind === 'system' ? (
            <p key={`sys-${idx}`} className="text-center text-xs italic text-slate-600">
              {item.text}
            </p>
          ) : (
            <div key={item.id || idx} className={item.senderUsername === currentUsername ? 'text-right' : ''}>
              <div
                className={`inline-block max-w-[85%] rounded-xl px-3 py-2 text-left text-sm ${
                  item.senderUsername === currentUsername
                    ? 'bg-accent/15 text-slate-100'
                    : 'bg-bg-soft text-slate-200'
                }`}
              >
                <p className="mb-0.5 text-xs font-semibold text-accent">{item.senderUsername}</p>
                <p className="break-words">{item.message}</p>
                <p className="mt-1 text-[10px] text-slate-500">{formatTime(item.timestamp)}</p>
              </div>
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-bg-border p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message..."
          maxLength={2000}
          className="input-field !py-2 text-sm"
        />
        <button type="submit" className="btn-primary !px-3 !py-2" disabled={!draft.trim()} aria-label="Send message">
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
