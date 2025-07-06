const express = require('express');
const sequelize = require('./database')
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const clientAuth = require('./routes/clientAuth');

require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const path = require('path');
const authMiddleware = require('./middleware/auth');
//Import des modeles
const User = require('./models/user');
const Product = require('./models/produits');
const Client = require('./models/clients');
const Commande = require('./models/commandes');
const Ingredient = require('./models/ingredients');

//creation de l'app
const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
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

// Import des routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);
const produitsRoutes = require('./routes/produits');
const commandesRoutes = require('./routes/commandes');
const clientsRoutes = require('./routes/clients');
const ingredientsRoutes = require('./routes/ingredients');

// Routes publiques
app.use('/api/auth', authRoutes);
app.use('/api/clients/auth', clientAuth);
app.use('/api/produits', produitsRoutes);

// Routes protégées
app.use('/api/commandes', authMiddleware, commandesRoutes);
app.use('/api/clients', authMiddleware, clientsRoutes);
app.use('/api/ingredients', authMiddleware, ingredientsRoutes);


//fonction database()
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const dataBase = async () => {
  const admin = await User.findOne({ where: { email: 'admin@patisserie.com' } });

  if (!admin) {
    await User.create({
      id: uuidv4(),
      nom: 'Admin',
      prenom: 'Super',
      email: 'admin@patisserie.com',
      password: bcrypt.hashSync('123456', 10),
      role: 'admin',
      createdAt: new Date(),
    });

    await Product.bulkCreate([
      {
        id: uuidv4(),
        nom: 'Tarte aux Fraises',
        description: 'Délicieuse tarte aux fraises fraîches sur pâte sablée',
        prix: 18.50,
        categorie: 'tartes',
        ingredients: JSON.stringify(['fraises', 'pâte sablée', 'crème pâtissière']),
        tempsPreparation: 120,
        difficulte: 'moyen',
        disponible: true,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        nom: 'Éclair au Chocolat',
        description: 'Éclair garni de crème au chocolat et glaçage chocolat',
        prix: 4.50,
        categorie: 'viennoiseries',
        ingredients: JSON.stringify(['pâte à choux', 'crème chocolat', 'glaçage']),
        tempsPreparation: 90,
        difficulte: 'difficile',
        disponible: true,
        createdAt: new Date(),
      },
    ]);
  }
};


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

// ✅ Route test pour client connecté
const authClient = require('./middleware/authClient');
app.get('/api/mes-commandes', authClient, (req, res) => {
  res.json({ message: `Bienvenue client ${req.user.email}, voici vos commandes.` });
});

//Synchronisation des modeles avec la bdd et demarrage serveur
const start = async () => {
  try {
    await sequelize.sync({ alter: true }); // Synchroniser les modèles
    console.log('Base de données synchronisée');
    await dataBase(); //ajout des données de base(admin, produits,etc..)

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