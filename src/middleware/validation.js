const Joi = require('joi');

const validateBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            error.isJoi = true;
            return next(error);
        }
        next();
    };
};

const validateParams = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.params);
        if (error) {
            error.isJoi = true;
            return next(error);
        }
        next();
    };
};

// Schémas de validation
const schemas = {
    // Produits
    produit: Joi.object({
        nom: Joi.string().required().min(2).max(100),
        description: Joi.string().max(500),
        prix: Joi.number().positive().required(),
        categorie: Joi.string().valid('gâteaux', 'tartes', 'viennoiseries', 'petits-fours', 'chocolats').required(),
        ingredients: Joi.array().items(Joi.string()),
        tempsPreparation: Joi.number().positive(),
        difficulte: Joi.string().valid('facile', 'moyen', 'difficile'),
        disponible: Joi.boolean().default(true)
    }),

    // Commandes
    commande: Joi.object({
        clientId: Joi.string().required(),
        produits: Joi.array().items(
            Joi.object({
                produitId: Joi.string().required(),
                quantite: Joi.number().positive().required(),
                personnalisation: Joi.string().max(200)
            })
        ).min(1).required(),
        dateRecuperation: Joi.date().min('now').required(),
        commentaires: Joi.string().max(500)
    }),

    // Clients
    client: Joi.object({
        nom: Joi.string().required().min(2).max(50),
        prenom: Joi.string().required().min(2).max(50),
        email: Joi.string().email().required(),
        telephone: Joi.string().pattern(/^[0-9\-\+\s\(\)]{10,}$/),
        adresse: Joi.object({
            rue: Joi.string().required(),
            ville: Joi.string().required(),
            codePostal: Joi.string().required(),
            pays: Joi.string().default('France')
        })
    }),

    // Ingrédients
    ingredient: Joi.object({
        nom: Joi.string().required().min(2).max(50),
        unite: Joi.string().valid('g', 'kg', 'ml', 'l', 'piece').required(),
        prix: Joi.number().positive(),
        fournisseur: Joi.string(),
        stock: Joi.number().min(0).default(0),
        seuilAlerte: Joi.number().min(0).default(10)
    }),

    // Auth
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    }),

    register: Joi.object({
        nom: Joi.string().required().min(2).max(50),
        prenom: Joi.string().required().min(2).max(50),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('admin', 'employee').default('employee')
    }),

    // Paramètres d'URL
    id: Joi.object({
        id: Joi.string().required()
    })
};

module.exports = {
    validateBody,
    validateParams,
    schemas
};