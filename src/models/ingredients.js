const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Ingredient extends Model { }

Ingredient.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    nom: DataTypes.STRING,
    unite: DataTypes.STRING,
    prix: DataTypes.FLOAT,
    fournisseur: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    seuilAlerte: DataTypes.INTEGER,
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, { sequelize, modelName: 'ingredient' });

module.exports = Ingredient;