const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Commande extends Model { }

Commande.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    clientId: {
        type: DataTypes.STRING,
        references: {
            model: 'clients', // Nom du modèle Client
            key: 'id',
        },
    },
    produits: DataTypes.JSON, // Stocker les produits en JSON
    dateCommande: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    dateRecuperation: DataTypes.DATE,
    statut: DataTypes.STRING,
    total: DataTypes.FLOAT,
    commentaires: DataTypes.TEXT,
}, { sequelize, modelName: 'commande' });

module.exports = Commande;