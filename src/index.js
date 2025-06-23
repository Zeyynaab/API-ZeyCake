const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite' // Chemin vers le fichier de base de données SQLite
});

module.exports = sequelize;