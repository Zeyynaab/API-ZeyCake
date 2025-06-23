const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Importer la connexion

class User extends Model { }

User.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    createdAt: DataTypes.DATE,
}, { sequelize, modelName: 'user' });

module.exports = User;