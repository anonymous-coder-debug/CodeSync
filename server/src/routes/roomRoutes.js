const express = require('express');
const {
  createRoom,
  getRoom,
  joinRoom,
  leaveRoom,
  getMyRooms,
  getRoomMessages,
} = require('../controllers/roomController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/mine/recent', getMyRooms);

router.post(
  '/',
  validate({
    name: { required: false, maxLength: 60 },
  }),
  createRoom
);

router.get('/:roomId', getRoom);
router.post('/:roomId/join', joinRoom);
router.delete('/:roomId/leave', leaveRoom);
router.get('/:roomId/messages', getRoomMessages);

module.exports = router;
