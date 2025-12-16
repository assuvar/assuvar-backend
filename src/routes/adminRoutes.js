const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Invite Route - Protected (Auth + Admin Role)
router.post('/invite', protect, admin, adminController.inviteUser);

module.exports = router;
