const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users, generateId } = require('../data/database');


// Obtenir le profil utilisateur actuel
exports.getProfile = (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user.id,
        nom: req.user.nom,
        prenom: req.user.prenom,
        email: req.user.email,
        role: req.user.role,
      },
    },
  });
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email, password, role } = req.body;

    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    // Hasher le mot de passe si mis à jour
    const hashedPassword = password ? await bcrypt.hash(password, 10) : users[userIndex].password;

    const updatedUser = { id, nom, prenom, email, password: hashedPassword, role };
    users[userIndex] = updatedUser;

    res.json({ success: true, message: 'Utilisateur mis à jour avec succès', data: updatedUser });
  } catch (error) {
    next(error);
  }
};

// Supprimer un utilisateur
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
  }

  users.splice(userIndex, 1);
  res.json({ success: true, message: 'Utilisateur supprimé avec succès' });
};