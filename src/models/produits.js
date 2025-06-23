const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Product extends Model {}

Product.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  prix: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  categorie: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ingredients: {
    type: DataTypes.JSON,
    allowNull: true, // facultatif selon ton usage
  },
  tempsPreparation: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  difficulte: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize,
  modelName: 'Product',
  timestamps: true, // ajoute createdAt et updatedAt automatiquement
});

module.exports = Product;
