const express = require('express');
const { loginController, logoutController, changePassword } = require('../controllers/authController');
const router = express.Router();

// Login route
router.post('/login', loginController);

// Logout route
router.post('/logout', logoutController);

router.put('/change-password', changePassword);

module.exports = router;
