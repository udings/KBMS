const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const authController = require("../controllers/authController");


router.post('/login', login);
router.post("/login", authController.login);

router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user }); 
});

module.exports = router;
