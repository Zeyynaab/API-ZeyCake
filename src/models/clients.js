const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Client extends Model { }

Client.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    email: DataTypes.STRING,
    telephone: DataTypes.STRING,
    adresse: DataTypes.JSON, // Stocker l'adresse en JSON
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, { sequelize, modelName: 'client' });

module.exports = Client;