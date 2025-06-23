const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Commande extends Model {}

Commande.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Clients', 
      key: 'id',
    },
  },
  produits: {
    type: DataTypes.JSON, 
    allowNull: false,
  },
  dateCommande: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  dateRecuperation: DataTypes.DATE,
  statut: {
    type: DataTypes.STRING,
    defaultValue: 'en-attente',
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  commentaires: DataTypes.TEXT,
}, {
  sequelize,
  modelName: 'Commande',
  timestamps: true, // createdAt, updatedAt
});

module.exports = Commande;
