const Client = require('../models/clients');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res, next) => {
  try {
    const { nom, prenom, email, password, telephone, adresse } = req.body;

    const existing = await Client.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nouveauClient = await Client.create({
      id: uuidv4(),
      nom,
      prenom,
      email,
      password: hashedPassword,
      telephone,
      adresse,
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, message: 'Compte client créé avec succès' });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const client = await Client.findOne({ where: { email } });

    if (!client || !(await bcrypt.compare(password, client.password))) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: client.id, email: client.email, role: 'client' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ success: true, token });
  } catch (err) {
    next(err);
  }
};
