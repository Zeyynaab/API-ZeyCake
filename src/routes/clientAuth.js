const express = require('express');
const router = express.Router();
const clientAuthController = require('../controllers/clientAuthController');

// Inscription
router.post('/register', clientAuthController.register);

// Connexion
router.post('/login', clientAuthController.login);

module.exports = router;
