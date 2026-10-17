import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import { Play, Users, MessageSquare, Copy, LogOut, Loader2, Code2 } from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { getRoom, getRoomMessages, leaveRoom as leaveRoomApi } from '../services/roomService';
import { executeCode } from '../services/codeService';
import { getErrorMessage } from '../services/api';
import { LANGUAGES } from '../utils/languageConfig';

import LanguageSelector from '../components/LanguageSelector';
import OutputConsole from '../components/OutputConsole';
import ChatPanel from '../components/ChatPanel';
import OnlineUsers from '../components/OnlineUsers';
import Loader from '../components/Loader';

export default function CodingRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const socket = useSocket();

  const [loadingRoom, setLoadingRoom] = useState(true);
  const [roomMeta, setRoomMeta] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [systemLog, setSystemLog] = useState([]);
  const [mobileTab, setMobileTab] = useState('editor'); // editor | chat | users

  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [runError, setRunError] = useState(null);

  const skipNextEmit = useRef(false);

  // --- Load initial room state + chat history over REST ---
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [roomRes, messagesRes] = await Promise.all([getRoom(roomId), getRoomMessages(roomId)]);
        if (cancelled) return;

        setRoomMeta(roomRes.data.room);
        setCode(roomRes.data.room.code || '');
        setLanguage(roomRes.data.room.language || 'javascript');
        setMessages(messagesRes.data.messages);
      } catch (err) {
        toast.error(getErrorMessage(err));
        navigate('/dashboard');
      } finally {
        if (!cancelled) setLoadingRoom(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [roomId, navigate]);

  // --- Socket lifecycle: join room, wire up all real-time listeners ---
  useEffect(() => {
    if (!socket || !user) return;

    const joinPayload = {
      roomId,
      user: { userId: user.id, username: user.username, avatarColor: user.avatarColor },
    };

    const doJoin = () => socket.emit('join-room', joinPayload);

    if (socket.connected) doJoin();
    socket.on('connect', doJoin);

    socket.on('code-sync', ({ code: initialCode, language: initialLang }) => {
      skipNextEmit.current = true;
      setCode(initialCode ?? '');
      if (initialLang) setLanguage(initialLang);
    });

    socket.on('code-update', ({ code: incoming }) => {
      skipNextEmit.current = true;
      setCode(incoming);
    });

    socket.on('language-update', ({ language: incoming }) => {
      setLanguage(incoming);
      toast('Language changed to ' + (LANGUAGES[incoming]?.label || incoming), { icon: '🔤' });
    });

    socket.on('users-update', (users) => setOnlineUsers(users));

    socket.on('user-joined', ({ username }) => {
      setSystemLog((prev) => [...prev, { text: `${username} joined the room`, timestamp: new Date() }]);
      toast(`${username} joined`, { icon: '👋' });
    });

    socket.on('user-left', ({ username }) => {
      setSystemLog((prev) => [...prev, { text: `${username} left the room`, timestamp: new Date() }]);
    });

    socket.on('receive-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('room-error', ({ message }) => {
      toast.error(message);
      navigate('/dashboard');
    });

    return () => {
      socket.emit('leave-room', { roomId });
      socket.off('connect', doJoin);
      socket.off('code-sync');
      socket.off('code-update');
      socket.off('language-update');
      socket.off('users-update');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('receive-message');
      socket.off('room-error');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, user, roomId]);

  const handleEditorChange = useCallback(
    (value) => {
      setCode(value ?? '');
      if (skipNextEmit.current) {
        skipNextEmit.current = false;
        return;
      }
      socket?.emit('code-change', { roomId, code: value ?? '' });
    },
    [socket, roomId]
  );

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    socket?.emit('language-change', { roomId, language: newLang });
  };

  const handleRun = async () => {
    setIsRunning(true);
    setRunError(null);
    setRunResult(null);
    try {
      const res = await executeCode({ language, code });
      setRunResult(res.data);
    } catch (err) {
      setRunError(getErrorMessage(err));
    } finally {
      setIsRunning(false);
    }
  };

  const handleSendMessage = (message) => {
    socket?.emit('send-message', { roomId, userId: user.id, username: user.username, message });
  };

  const handleLeave = async () => {
    try {
      await leaveRoomApi(roomId);
    } catch {
      // Non-fatal - room membership is best-effort cleanup
    }
    navigate('/dashboard');
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success('Room ID copied to clipboard');
  };

  if (loadingRoom) {
    return <Loader fullScreen label="Loading room..." />;
  }

  return (
    <div className="flex h-screen flex-col bg-bg">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-bg-border bg-bg-soft px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-1.5 font-display text-sm font-semibold text-white">
            <Code2 size={18} className="text-accent" />
            CodeSync
          </Link>
          <span className="hidden text-slate-600 sm:inline">/</span>
          <button
            onClick={copyRoomId}
            className="hidden items-center gap-1.5 rounded-md bg-bg-card px-2.5 py-1 font-mono text-xs text-slate-400 hover:text-accent sm:flex"
            title="Copy room ID"
          >
            {roomId} <Copy size={12} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector value={language} onChange={handleLanguageChange} />
          <button onClick={handleRun} disabled={isRunning} className="btn-primary !px-4 !py-1.5 text-sm">
            {isRunning ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
            Run
          </button>
          <button onClick={handleLeave} className="btn-secondary !px-3 !py-1.5 text-sm">
            <LogOut size={14} />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </header>

      {/* Mobile tab switcher */}
      <div className="flex border-b border-bg-border bg-bg-soft lg:hidden">
        {['editor', 'chat', 'users'].map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-2 text-xs font-medium capitalize ${
              mobileTab === tab ? 'border-b-2 border-accent text-accent' : 'text-slate-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor + output */}
        <div className={`flex-1 flex-col overflow-hidden lg:flex ${mobileTab === 'editor' ? 'flex' : 'hidden'}`}>
          <div className="flex-1 overflow-hidden" style={{ minHeight: '55%' }}>
            <Editor
              height="100%"
              language={LANGUAGES[language]?.monacoId || 'javascript'}
              value={code}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: 'JetBrains Mono, monospace',
                minimap: { enabled: false },
                automaticLayout: true,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
          <div className="h-48 shrink-0 border-t border-bg-border lg:h-56">
            <OutputConsole result={runResult} isRunning={isRunning} error={runError} />
          </div>
        </div>

        {/* Sidebar: users + chat (desktop) */}
        <div className={`w-full flex-col border-l border-bg-border bg-bg-soft lg:flex lg:w-80 ${mobileTab === 'users' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="h-56 shrink-0 border-b border-bg-border">
            <OnlineUsers users={onlineUsers} />
          </div>
          <div className={`min-h-0 flex-1 ${mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'} flex-col`}>
            <ChatPanel messages={messages} systemLog={systemLog} onSend={handleSendMessage} currentUsername={user?.username} />
          </div>
        </div>

        {/* Mobile-only standalone chat tab (since desktop layout hides it under lg:flex above) */}
        <div className={`w-full flex-col bg-bg-soft lg:hidden ${mobileTab === 'chat' ? 'flex' : 'hidden'}`}>
          <ChatPanel messages={messages} systemLog={systemLog} onSend={handleSendMessage} currentUsername={user?.username} />
        </div>
      </div>
    </div>
  );
}
