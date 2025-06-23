const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const Ingredient = require('../models/ingredients');

// Récupérer tous les ingrédients
exports.getAllIngredients = async (req, res) => {
    const { recherche, unite, stockFaible } = req.query;

    let where = {};

    if (recherche) {
        where[Op.or] = [
            { nom: { [Op.like]: `%${recherche}%` } },
            { fournisseur: { [Op.like]: `%${recherche}%` } }
        ];
    }

    if (unite) where.unite = unite;
    if (stockFaible === 'true') {
        where.stock = { [Op.lte]: Sequelize.col('seuilAlerte') };
    }

    const ingredients = await Ingredient.findAll({ where });

    res.json({
        success: true,
        data: ingredients,
        total: ingredients.length,
        alertes: ingredients.filter(i => i.stock <= i.seuilAlerte).length,
    });
};

// Récupérer un ingrédient par ID
exports.getIngredientById = async (req, res) => {
    const ingredient = await Ingredient.findByPk(req.params.id);
    if (!ingredient) {
        return res.status(404).json({ success: false, message: 'Ingrédient non trouvé' });
    }

    res.json({ success: true, data: ingredient });
};

// Créer un nouvel ingrédient
exports.createIngredient = async (req, res, next) => {
    try {
        const exist = await Ingredient.findOne({ where: { nom: req.body.nom } });
        if (exist) {
            return res.status(400).json({ success: false, message: 'Un ingrédient avec ce nom existe déjà' });
        }

        const ingredient = await Ingredient.create({
            id: uuidv4(),
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(201).json({
            success: true,
            message: 'Ingrédient créé avec succès',
            data: ingredient,
        });
    } catch (error) {
        next(error);
    }
};

// Mettre à jour un ingrédient
exports.updateIngredient = async (req, res, next) => {
    try {
        const ingredient = await Ingredient.findByPk(req.params.id);
        if (!ingredient) {
            return res.status(404).json({ success: false, message: 'Ingrédient non trouvé' });
        }

        const exist = await Ingredient.findOne({
            where: {
                nom: req.body.nom,
                id: { [Op.ne]: req.params.id }
            }
        });
        if (exist) {
            return res.status(400).json({ success: false, message: 'Un autre ingrédient avec ce nom existe déjà' });
        }

        await ingredient.update({ ...req.body, updatedAt: new Date() });

        res.json({
            success: true,
            message: 'Ingrédient mis à jour avec succès',
            data: ingredient,
        });
    } catch (error) {
        next(error);
    }
};

// Mettre à jour le stock d’un ingrédient
exports.updateIngredientStock = async (req, res, next) => {
    try {
        const { quantite, operation } = req.body;

        if (!quantite || !operation || !['ajouter', 'retirer'].includes(operation)) {
            return res.status(400).json({ success: false, message: 'Quantité et opération requises' });
        }

        if (quantite <= 0) {
            return res.status(400).json({ success: false, message: 'La quantité doit être positive' });
        }

        const ingredient = await Ingredient.findByPk(req.params.id);
        if (!ingredient) {
            return res.status(404).json({ success: false, message: 'Ingrédient non trouvé' });
        }

        let nouveauStock = operation === 'ajouter'
            ? ingredient.stock + quantite
            : ingredient.stock - quantite;

        if (nouveauStock < 0) {
            return res.status(400).json({ success: false, message: 'Stock insuffisant' });
        }

        await ingredient.update({ stock: nouveauStock, updatedAt: new Date() });

        res.json({
            success: true,
            message: `Stock ${operation === 'ajouter' ? 'ajouté' : 'retiré'} avec succès`,
            data: ingredient,
            alerte: nouveauStock <= ingredient.seuilAlerte
        });
    } catch (error) {
        next(error);
    }
};

// Supprimer un ingrédient
exports.deleteIngredient = async (req, res) => {
    const ingredient = await Ingredient.findByPk(req.params.id);
    if (!ingredient) {
        return res.status(404).json({ success: false, message: 'Ingrédient non trouvé' });
    }

    await ingredient.destroy();

    res.json({
        success: true,
        message: 'Ingrédient supprimé avec succès',
        data: ingredient,
    });
};

// Récupérer les alertes de stock
exports.getAlertesStock = async (req, res) => {
    const alertes = await Ingredient.findAll({
        where: {
            stock: { [Op.lte]: Sequelize.col('seuilAlerte') }
        }
    });

    res.json({
        success: true,
        data: alertes,
        total: alertes.length,
    });
};
