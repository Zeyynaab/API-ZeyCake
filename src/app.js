const express = require('express');
const sequelize = require('./database')
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');

//Import des modeles
const User = require('./models/user');
const Product = require('./models/produits');
const Client = require('./models/clients');
const Commande = require('./models/commandes');
const Ingredient = require('./models/ingredients');

// Import des routes
const authRoutes = require('./routes/authRoutes');
const produitsRoutes = require('./routes/produits');
const commandesRoutes = require('./routes/commandes');
const clientsRoutes = require('./routes/clients');
const ingredientsRoutes = require('./routes/ingredients');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration du rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par windowMs
  message: 'Trop de requêtes depuis cette IP, réessayez plus tard.'
});

// Middlewares globaux
app.use(helmet()); // Sécurité HTTP headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging des requêtes
app.use(limiter); // Rate limiting
app.use(express.json({ limit: '10mb' })); // Parser JSON
app.use(express.urlencoded({ extended: true }));

// Routes publiques
app.use('/api/auth', authRoutes);

// Routes protégées
app.use('/api/produits', authMiddleware, produitsRoutes);
app.use('/api/commandes', authMiddleware, commandesRoutes);
app.use('/api/clients', authMiddleware, clientsRoutes);
app.use('/api/ingredients', authMiddleware, ingredientsRoutes);

// Route de base pour tester l'API
app.get('/', (req, res) => {
  res.json({
    message: 'API ZeyCake - Bienvenue!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      produits: '/api/produits',
      commandes: '/api/commandes',
      clients: '/api/clients',
      ingredients: '/api/ingredients'
    }
  });
});

// Middleware de gestion d'erreurs 
app.use(errorHandler);

//Synchronisation des modeles avec la bdd et demarrage serveur
const start = async () => {
  try {
    await sequelize.sync({ force: true }); // Synchroniser les modèles
    console.log('Base de données synchronisée');
    //Demarrage du serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`📖 Documentation: http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error('Erreur de synchronisation :', error);
  }
};

start();

module.exports = app;