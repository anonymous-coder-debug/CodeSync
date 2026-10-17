const { customAlphabet } = require('nanoid');

// Unambiguous alphabet (no 0/O/1/I/l) for room IDs people type by hand
const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 8);

const generateRoomId = () => nanoid();

module.exports = generateRoomId;
