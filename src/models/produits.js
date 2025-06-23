const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Product extends Model { }

Product.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    nom: DataTypes.STRING,
    description: DataTypes.TEXT,
    prix: DataTypes.FLOAT,
    categorie: DataTypes.STRING,
    ingredients: DataTypes.JSON, // Utiliser JSON pour stocker les ingrédients
    tempsPreparation: DataTypes.INTEGER,
    difficulte: DataTypes.STRING,
    disponible: DataTypes.BOOLEAN,
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, { sequelize, modelName: 'product' });

module.exports = Product;