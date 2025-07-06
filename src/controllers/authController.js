// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require ('../models/user');

// Inscription
exports.register = async (req, res, next) => {
    try {
        const { nom, prenom, email, password, role } = req.body;

        // Vérifier si l'utilisateur existe déjà
        //const existingUser = users.find(user => user.email === email);
        const existingUser = await User.findOne({ where: { email } }); //sequelize
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Un utilisateur avec cet email existe déjà',
            });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer le nouvel utilisateur
        const newUser = await User.create({
            id: uuidv4(),
            nom,
            prenom,
            email,
            password: hashedPassword,
            role: role || 'employee',
            createdAt: new Date(),
        });
        //users.push(newUser);

        // Créer le token JWT
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            //{ expiresIn: process.env.JWT_EXPIRES_IN } //token sans expiration temporairement
        );

        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès',
            data: {
                user: {
                    id: newUser.id,
                    nom: newUser.nom,
                    prenom: newUser.prenom,
                    email: newUser.email,
                    role: newUser.role,
                },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Connexion
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Trouver l'utilisateur dans la BDD
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect',
            });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect',
            });
        }

        // Créer le token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            success: true,
            message: 'Connexion réussie',
            data: {
                user: {
                    id: user.id,
                    nom: user.nom,
                    prenom: user.prenom,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};