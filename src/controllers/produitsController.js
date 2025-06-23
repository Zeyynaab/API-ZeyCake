const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const Produit = require('../models/produits');

// Récupérer tous les produits
exports.getAllProduits = async (req, res) => {
    const { categorie, disponible, recherche } = req.query;

    let where = {};

    if (categorie) where.categorie = categorie;
    if (disponible !== undefined) where.disponible = disponible === 'true';
    if (recherche) {
        where[Op.or] = [
            { nom: { [Op.like]: `%${recherche}%` } },
            { description: { [Op.like]: `%${recherche}%` } }
        ];
    }

    const produits = await Produit.findAll({ where });

    res.json({
        success: true,
        data: produits,
        total: produits.length,
    });
};

// Récupérer un produit par ID
exports.getProduitById = async (req, res) => {
    const produit = await Produit.findByPk(req.params.id);
    if (!produit) {
        return res.status(404).json({
            success: false,
            message: 'Produit non trouvé',
        });
    }

    res.json({
        success: true,
        data: produit,
    });
};

// Créer un nouveau produit
exports.createProduit = async (req, res, next) => {
    try {
        const produit = await Produit.create({
            id: uuidv4(),
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        res.status(201).json({
            success: true,
            message: 'Produit créé avec succès',
            data: produit,
        });
    } catch (error) {
        next(error);
    }
};

// Mettre à jour un produit
exports.updateProduit = async (req, res, next) => {
    try {
        const produit = await Produit.findByPk(req.params.id);
        if (!produit) {
            return res.status(404).json({
                success: false,
                message: 'Produit non trouvé',
            });
        }

        await produit.update({
            ...req.body,
            updatedAt: new Date(),
        });

        res.json({
            success: true,
            message: 'Produit mis à jour avec succès',
            data: produit,
        });
    } catch (error) {
        next(error);
    }
};

// Supprimer un produit
exports.deleteProduit = async (req, res) => {
    const produit = await Produit.findByPk(req.params.id);
    if (!produit) {
        return res.status(404).json({
            success: false,
            message: 'Produit non trouvé',
        });
    }

    await produit.destroy();

    res.json({
        success: true,
        message: 'Produit supprimé avec succès',
        data: produit,
    });
};

// Récupérer les catégories disponibles
exports.getCategories = (req, res) => {
    const categories = ['gâteaux', 'tartes', 'viennoiseries', 'petits-fours', 'chocolats'];
    res.json({
        success: true,
        data: categories,
    });
};
