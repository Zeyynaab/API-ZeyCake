const bcrypt = require('bcryptjs');

// Données de test

const users = [
    {
        id: generateId(),
        nom: 'Admin',
        prenom: 'Super',
        email: 'admin@patisserie.com',
        password: bcrypt.hashSync('123456', 10),
        role: 'admin',
        createdAt: new Date().toISOString() // Format ISO pour SQLite
    }
];

const produits = [
    {
        id: generateId(),
        nom: 'Tarte aux Fraises',
        description: 'Délicieuse tarte aux fraises fraîches sur pâte sablée',
        prix: 18.50,
        categorie: 'tartes',
        ingredients: JSON.stringify(['fraises', 'pâte sablée', 'crème pâtissière']), // Stocker en tant que chaîne JSON
        tempsPreparation: 120,
        difficulte: 'moyen',
        disponible: true,
        createdAt: new Date().toISOString()
    },
    {
        id: generateId(),
        nom: 'Éclair au Chocolat',
        description: 'Éclair garni de crème au chocolat et glaçage chocolat',
        prix: 4.50,
        categorie: 'viennoiseries',
        ingredients: JSON.stringify(['pâte à choux', 'crème chocolat', 'glaçage']),
        tempsPreparation: 90,
        difficulte: 'difficile',
        disponible: true,
        createdAt: new Date().toISOString()
    }
];

const clients = [
    {
        id: generateId(),
        nom: 'Dupont',
        prenom: 'Marie',
        email: 'marie.dupont@email.com',
        telephone: '0123456789',
        adresse: JSON.stringify({ // Stocker l'adresse en tant que chaîne JSON
            rue: '123 Rue de la Paix',
            ville: 'Paris',
            codePostal: '75001',
            pays: 'France'
        }),
        createdAt: new Date().toISOString()
    }
];

const commandes = [
    {
        id: generateId(),
        clientId: '1',
        produits: JSON.stringify([ // Stocker les produits en tant que chaîne JSON
            {
                produitId: '1',
                quantite: 1,
                personnalisation: 'Sans sucre ajouté'
            }
        ]),
        dateCommande: new Date().toISOString(),
        dateRecuperation: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 heures plus tard
        statut: 'en-preparation',
        total: 18.50,
        commentaires: 'Anniversaire de mariage'
    }
];

const ingredients = [
    {
        id: generateId(),
        nom: 'Farine T55',
        unite: 'kg',
        prix: 1.50,
        fournisseur: 'Moulin du Coin',
        stock: 25,
        seuilAlerte: 5,
        createdAt: new Date().toISOString()
    },
    {
        id: generateId(),
        nom: 'Sucre en poudre',
        unite: 'kg',
        prix: 1.20,
        fournisseur: 'Sucre & Co',
        stock: 15,
        seuilAlerte: 3,
        createdAt: new Date().toISOString()
    }
];

// Fonctions utilitaires pour gérer les IDs
const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

module.exports = {
    users,
    produits,
    clients,
    commandes,
    ingredients,
    generateId
};