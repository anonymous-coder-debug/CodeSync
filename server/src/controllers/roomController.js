const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Room = require('../models/Room');
const Message = require('../models/Message');
const generateRoomId = require('../utils/generateRoomId');
const { getLanguageConfig, isSupportedLanguage } = require('../utils/languageConfig');

// @route   POST /api/rooms
const createRoom = asyncHandler(async (req, res) => {
  const { name, language } = req.body;
  const lang = isSupportedLanguage(language) ? language : 'javascript';

  let roomId;
  let attempts = 0;
  // Extremely unlikely to collide, but guard against it anyway
  do {
    roomId = generateRoomId();
    attempts += 1;
    // eslint-disable-next-line no-await-in-loop
    var exists = await Room.findOne({ roomId });
  } while (exists && attempts < 5);

  const room = await Room.create({
    roomId,
    name: name || `${req.user.username}'s Room`,
    owner: req.user._id,
    language: lang,
    code: getLanguageConfig(lang).defaultCode,
    members: [{ user: req.user._id }],
  });

  res.status(201).json({
    success: true,
    message: 'Room created successfully',
    data: { room: room.toSummary() },
  });
});

// @route   GET /api/rooms/:roomId
const getRoom = asyncHandler(async (req, res) => {
  const room = await Room.findOne({ roomId: req.params.roomId.toUpperCase() })
    .populate('owner', 'username avatarColor')
    .populate('members.user', 'username avatarColor');

  if (!room) {
    throw new ApiError(404, 'Room not found. Check the room ID and try again.');
  }

  res.status(200).json({
    success: true,
    data: {
      room: {
        roomId: room.roomId,
        name: room.name,
        owner: room.owner,
        members: room.members,
        language: room.language,
        code: room.code,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
      },
    },
  });
});

// @route   POST /api/rooms/:roomId/join
const joinRoom = asyncHandler(async (req, res) => {
  const room = await Room.findOne({ roomId: req.params.roomId.toUpperCase() });

  if (!room) {
    throw new ApiError(404, 'Room not found. Check the room ID and try again.');
  }

  const alreadyMember = room.members.some((m) => m.user.toString() === req.user._id.toString());
  if (!alreadyMember) {
    room.members.push({ user: req.user._id });
    await room.save();
  }

  res.status(200).json({
    success: true,
    message: 'Joined room successfully',
    data: { room: room.toSummary() },
  });
});

// @route   DELETE /api/rooms/:roomId/leave
const leaveRoom = asyncHandler(async (req, res) => {
  const room = await Room.findOne({ roomId: req.params.roomId.toUpperCase() });

  if (!room) {
    throw new ApiError(404, 'Room not found');
  }

  room.members = room.members.filter((m) => m.user.toString() !== req.user._id.toString());
  await room.save();

  res.status(200).json({
    success: true,
    message: 'Left room successfully',
  });
});

// @route   GET /api/rooms/mine/recent
const getMyRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({ 'members.user': req.user._id })
    .sort({ updatedAt: -1 })
    .limit(10)
    .populate('owner', 'username');

  res.status(200).json({
    success: true,
    data: { rooms: rooms.map((r) => r.toSummary()) },
  });
});

// @route   GET /api/rooms/:roomId/messages
const getRoomMessages = asyncHandler(async (req, res) => {
  const room = await Room.findOne({ roomId: req.params.roomId.toUpperCase() });
  if (!room) {
    throw new ApiError(404, 'Room not found');
  }

  const messages = await Message.find({ room: room._id }).sort({ timestamp: 1 }).limit(200);

  res.status(200).json({
    success: true,
    data: { messages },
  });
});

module.exports = { createRoom, getRoom, joinRoom, leaveRoom, getMyRooms, getRoomMessages };
