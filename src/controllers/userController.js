const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/users');

// Obtenir le profil utilisateur actuel
exports.getProfile = async (req, res) => {
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

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

    await user.update({
      nom,
      prenom,
      email,
      password: hashedPassword,
      role,
      updatedAt: new Date(),
    });

    res.json({ success: true, message: 'Utilisateur mis à jour avec succès', data: user });
  } catch (error) {
    next(error);
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
  }

  await user.destroy();

  res.json({ success: true, message: 'Utilisateur supprimé avec succès' });
};
