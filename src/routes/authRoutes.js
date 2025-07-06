// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const admin = require('../middleware/admin'); 
// Route pour l'inscription
router.post('/register', admin, authController.register);

// Route pour la connexion
router.post('/login', authController.login);

module.exports = router;