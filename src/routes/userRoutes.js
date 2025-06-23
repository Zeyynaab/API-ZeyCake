const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//router.get('/', userController.getAllUsers);

// Obtenir le profil utilisateur actuel
router.get('/profile', require('../middleware/auth'), userController.getProfile);

// Mettre à jour un utilisateur
router.put('/:id', require('../middleware/auth'), validateBody(schemas.update), userController.updateUser);

// Supprimer un utilisateur
router.delete('/:id', require('../middleware/auth'), userController.deleteUser);


module.exports = router;
