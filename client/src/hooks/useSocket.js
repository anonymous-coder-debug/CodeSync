import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// Creates one socket connection per mounted component (the coding room),
// and cleanly tears it down on unmount so we never leak connections
// or double-fire events when navigating between rooms.
export function useSocket() {
  const socketRef = useRef(null);

  if (!socketRef.current) {
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001', {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });
  }

  useEffect(() => {
    const socket = socketRef.current;
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef.current;
}
