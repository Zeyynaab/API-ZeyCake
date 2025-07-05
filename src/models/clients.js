const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database'); // ou ../config/sequelize si tu as déplacé

class Client extends Model {}

Client.init({
  id: {
    type: DataTypes.UUID, // Meilleure pratique : UUID
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telephone: DataTypes.STRING,
  adresse: {
    type: DataTypes.JSON, // JSON pour l’objet adresse
    allowNull: true,
  },
  
}, {
  sequelize,
  modelName: 'Client',
  timestamps: true, // ajoute createdAt et updatedAt automatiquement
});

module.exports = Client;
