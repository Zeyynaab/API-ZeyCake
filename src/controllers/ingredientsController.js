const { ingredients, generateId } = require('../data/database');

// Récupérer tous les ingrédients
exports.getAllIngredients = (req, res) => {
    const { recherche, unite, stockFaible } = req.query;

    let filteredIngredients = [...ingredients];

    // Recherche par nom
    if (recherche) {
        const searchTerm = recherche.toLowerCase();
        filteredIngredients = filteredIngredients.filter(i =>
            i.nom.toLowerCase().includes(searchTerm) ||
            (i.fournisseur && i.fournisseur.toLowerCase().includes(searchTerm))
        );
    }

    // Filtrer par unité
    if (unite) {
        filteredIngredients = filteredIngredients.filter(i => i.unite === unite);
    }

    // Filtrer les stocks faibles
    if (stockFaible === 'true') {
        filteredIngredients = filteredIngredients.filter(i => i.stock <= i.seuilAlerte);
    }

    res.json({
        success: true,
        data: filteredIngredients,
        total: filteredIngredients.length,
        alertes: filteredIngredients.filter(i => i.stock <= i.seuilAlerte).length,
    });
};

// Récupérer un ingrédient par ID
exports.getIngredientById = (req, res) => {
    const ingredient = ingredients.find(i => i.id === req.params.id);
    if (!ingredient) {
        return res.status(404).json({
            success: false,
            message: 'Ingrédient non trouvé',
        });
    }

    res.json({
        success: true,
        data: ingredient,
    });
};

// Créer un nouvel ingrédient
exports.createIngredient = (req, res, next) => {
    try {
        // Vérifier si l'ingrédient existe déjà
        const existingIngredient = ingredients.find(i =>
            i.nom.toLowerCase() === req.body.nom.toLowerCase()
        );
        if (existingIngredient) {
            return res.status(400).json({
                success: false,
                message: 'Un ingrédient avec ce nom existe déjà',
            });
        }

        const nouvelIngredient = {
            id: generateId(),
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        ingredients.push(nouvelIngredient);

        res.status(201).json({
            success: true,
            message: 'Ingrédient créé avec succès',
            data: nouvelIngredient,
        });
    } catch (error) {
        next(error);
    }
};

// Mettre à jour un ingrédient
exports.updateIngredient = (req, res, next) => {
    try {
        const index = ingredients.findIndex(i => i.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Ingrédient non trouvé',
            });
        }

        // Vérifier si le nom existe déjà (sauf pour l'ingrédient actuel)
        const existingIngredient = ingredients.find(i =>
            i.nom.toLowerCase() === req.body.nom.toLowerCase() && i.id !== req.params.id
        );
        if (existingIngredient) {
            return res.status(400).json({
                success: false,
                message: 'Un autre ingrédient avec ce nom existe déjà',
            });
        }

        ingredients[index] = {
            ...ingredients[index],
            ...req.body,
            updatedAt: new Date(),
        };

        res.json({
            success: true,
            message: 'Ingrédient mis à jour avec succès',
            data: ingredients[index],
        });
    } catch (error) {
        next(error);
    }
};

// Mettre à jour le stock d'un ingrédient
exports.updateIngredientStock = (req, res, next) => {
    try {
        const { quantite, operation } = req.body; // operation: 'ajouter' ou 'retirer'

        if (!quantite || !operation || !['ajouter', 'retirer'].includes(operation)) {
            return res.status(400).json({
                success: false,
                message: 'Quantité et opération (ajouter/retirer) requises',
            });
        }

        if (quantite <= 0) {
            return res.status(400).json({
                success: false,
                message: 'La quantité doit être positive',
            });
        }

        const index = ingredients.findIndex(i => i.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Ingrédient non trouvé',
            });
        }

        const ingredient = ingredients[index];
        let nouveauStock;

        if (operation === 'ajouter') {
            nouveauStock = ingredient.stock + quantite;
        } else {
            nouveauStock = ingredient.stock - quantite;
            if (nouveauStock < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Stock insuffisant pour cette opération',
                });
            }
        }

        ingredients[index].stock = nouveauStock;
        ingredients[index].updatedAt = new Date();

        res.json({
            success: true,
            message: `Stock ${operation === 'ajouter' ? 'ajouté' : 'retiré'} avec succès`,
            data: ingredients[index],
            alerte: nouveauStock <= ingredient.seuilAlerte,
        });
    } catch (error) {
        next(error);
    }
};

// Supprimer un ingrédient
exports.deleteIngredient = (req, res) => {
    const index = ingredients.findIndex(i => i.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Ingrédient non trouvé',
        });
    }

    const ingredientSupprime = ingredients.splice(index, 1);

    res.json({
        success: true,
        message: 'Ingrédient supprimé avec succès',
        data: ingredientSupprime,
    });
};

// Récupérer les alertes de stock
exports.getAlertesStock = (req, res) => {
    const alertes = ingredients.filter(i => i.stock <= i.seuilAlerte);
    res.json({
        success: true,
        data: alertes,
        total: alertes.length,
    });
};