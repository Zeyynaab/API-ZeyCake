const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Ingredient extends Model {}

Ingredient.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unite: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prix: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  fournisseur: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  seuilAlerte: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
  },
}, {
  sequelize,
  modelName: 'Ingredient',
  timestamps: true, // Ajoute createdAt et updatedAt automatiquement
});

module.exports = Ingredient;
