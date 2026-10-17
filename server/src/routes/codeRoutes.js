const express = require('express');
const { executeCode } = require('../controllers/codeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/execute', protect, executeCode);

module.exports = router;
