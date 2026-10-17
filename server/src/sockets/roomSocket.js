const Room = require('../models/Room');
const Message = require('../models/Message');

// In-memory presence tracking: { [roomId]: { [socketId]: { userId, username, avatarColor } } }
// This is intentionally in-memory (not DB-backed) because "who is online right now"
// is ephemeral state that should reset on server restart and never persist stale users.
const roomPresence = {};

// Debounce map so we don't hammer MongoDB on every keystroke: { [roomId]: timeoutId }
const saveTimers = {};
const SAVE_DEBOUNCE_MS = 1500;

const getUsersInRoom = (roomId) => Object.values(roomPresence[roomId] || {});

const scheduleCodeSave = (roomId, code, language) => {
  if (saveTimers[roomId]) clearTimeout(saveTimers[roomId]);
  saveTimers[roomId] = setTimeout(async () => {
    try {
      const update = { code };
      if (language) update.language = language;
      await Room.findOneAndUpdate({ roomId }, update);
    } catch (err) {
      console.error(`[Socket] Failed to persist code for room ${roomId}:`, err.message);
    }
  }, SAVE_DEBOUNCE_MS);
};

function registerRoomHandlers(io, socket) {
  // Track which room this socket belongs to, for clean disconnect handling
  let currentRoomId = null;
  let currentUser = null;

  socket.on('join-room', async ({ roomId, user }) => {
    try {
      if (!roomId || !user) return;

      const normalizedRoomId = roomId.toUpperCase();
      const room = await Room.findOne({ roomId: normalizedRoomId });

      if (!room) {
        socket.emit('room-error', { message: 'Room not found' });
        return;
      }

      // Leave any previous room first (defensive, prevents ghost membership)
      if (currentRoomId) {
        socket.leave(currentRoomId);
        delete (roomPresence[currentRoomId] || {})[socket.id];
      }

      socket.join(normalizedRoomId);
      currentRoomId = normalizedRoomId;
      currentUser = user;

      roomPresence[normalizedRoomId] = roomPresence[normalizedRoomId] || {};
      roomPresence[normalizedRoomId][socket.id] = user;

      // Send the current, authoritative code + language ONLY to the joining client
      socket.emit('code-sync', { code: room.code, language: room.language });

      // Let everyone (including the joiner) know the updated user list
      io.to(normalizedRoomId).emit('users-update', getUsersInRoom(normalizedRoomId));

      // Notify existing members that someone joined (skip a duplicate toast for the joiner)
      socket.to(normalizedRoomId).emit('user-joined', { username: user.username });
    } catch (err) {
      console.error('[Socket] join-room error:', err.message);
      socket.emit('room-error', { message: 'Failed to join room' });
    }
  });

  socket.on('code-change', ({ roomId, code }) => {
    if (!roomId || typeof code !== 'string') return;
    const normalizedRoomId = roomId.toUpperCase();

    // Broadcast to everyone else in the room only - never echo back to the sender,
    // which is what prevents infinite update loops on the frontend.
    socket.to(normalizedRoomId).emit('code-update', { code });

    scheduleCodeSave(normalizedRoomId, code);
  });

  socket.on('language-change', async ({ roomId, language }) => {
    if (!roomId || !language) return;
    const normalizedRoomId = roomId.toUpperCase();

    socket.to(normalizedRoomId).emit('language-update', { language });

    try {
      await Room.findOneAndUpdate({ roomId: normalizedRoomId }, { language });
    } catch (err) {
      console.error('[Socket] Failed to persist language change:', err.message);
    }
  });

  socket.on('cursor-change', ({ roomId, position, username }) => {
    if (!roomId) return;
    socket.to(roomId.toUpperCase()).emit('cursor-update', { socketId: socket.id, position, username });
  });

  socket.on('send-message', async ({ roomId, userId, username, message }) => {
    try {
      if (!roomId || !message || !message.trim()) return;
      const normalizedRoomId = roomId.toUpperCase();

      const room = await Room.findOne({ roomId: normalizedRoomId });
      if (!room) return;

      const saved = await Message.create({
        room: room._id,
        sender: userId,
        senderUsername: username,
        message: message.trim(),
      });

      io.to(normalizedRoomId).emit('receive-message', {
        id: saved._id,
        senderUsername: saved.senderUsername,
        message: saved.message,
        timestamp: saved.timestamp,
      });
    } catch (err) {
      console.error('[Socket] send-message error:', err.message);
    }
  });

  const handleLeave = () => {
    if (!currentRoomId) return;

    delete (roomPresence[currentRoomId] || {})[socket.id];
    socket.leave(currentRoomId);

    io.to(currentRoomId).emit('users-update', getUsersInRoom(currentRoomId));
    if (currentUser) {
      io.to(currentRoomId).emit('user-left', { username: currentUser.username });
    }

    currentRoomId = null;
    currentUser = null;
  };

  socket.on('leave-room', handleLeave);
  socket.on('disconnect', handleLeave);
}

module.exports = { registerRoomHandlers };
