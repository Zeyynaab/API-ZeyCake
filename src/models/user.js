const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class User extends Model {}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Génère automatiquement un UUID
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
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'client', // ou 'admin'
  },
}, {
  sequelize,
  modelName: 'User',
  timestamps: true, // Ajoute automatiquement createdAt et updatedAt
});

module.exports = User;
