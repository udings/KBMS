const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');


router.post('/login', login);


router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user }); 
});

module.exports = router;
