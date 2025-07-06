// middleware/auth.js
const jwt = require('jsonwebtoken');
const User  = require('../models/user');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Accès refusé. Token manquant.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //const user = users.find(u => u.id === decoded.userId);
        const user = await User.findByPk(decoded.userId); //sequelize
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token invalide'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authMiddleware;