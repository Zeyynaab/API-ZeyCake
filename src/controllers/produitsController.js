const { produits, generateId } = require('../data/database');

// Récupérer tous les produits
exports.getAllProduits = (req, res) => {
    const { categorie, disponible, recherche } = req.query;

    let filteredProduits = [...produits];

    // Filtrer par catégorie
    if (categorie) {
        filteredProduits = filteredProduits.filter(p => p.categorie === categorie);
    }

    // Filtrer par disponibilité
    if (disponible !== undefined) {
        filteredProduits = filteredProduits.filter(p => p.disponible === (disponible === 'true'));
    }

    // Recherche par nom ou description
    if (recherche) {
        const searchTerm = recherche.toLowerCase();
        filteredProduits = filteredProduits.filter(p =>
            p.nom.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }

    res.json({
        success: true,
        data: filteredProduits,
        total: filteredProduits.length,
    });
};

// Récupérer un produit par ID
exports.getProduitById = (req, res) => {
    const produit = produits.find(p => p.id === req.params.id);
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
exports.createProduit = (req, res, next) => {
    try {
        const nouveauProduit = {
            id: generateId(),
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        produits.push(nouveauProduit);

        res.status(201).json({
            success: true,
            message: 'Produit créé avec succès',
            data: nouveauProduit,
        });
    } catch (error) {
        next(error);
    }
};

// Mettre à jour un produit
exports.updateProduit = (req, res, next) => {
    try {
        const index = produits.findIndex(p => p.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Produit non trouvé',
            });
        }

        produits[index] = {
            ...produits[index],
            ...req.body,
            updatedAt: new Date(),
        };

        res.json({
            success: true,
            message: 'Produit mis à jour avec succès',
            data: produits[index],
        });
    } catch (error) {
        next(error);
    }
};

// Supprimer un produit
exports.deleteProduit = (req, res) => {
    const index = produits.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Produit non trouvé',
        });
    }

    const produitSupprime = produits.splice(index, 1);

    res.json({
        success: true,
        message: 'Produit supprimé avec succès',
        data: produitSupprime,
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