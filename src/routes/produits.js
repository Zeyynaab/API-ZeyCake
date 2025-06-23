const express = require('express');
const { validateBody, validateParams, schemas } = require('../middleware/validation');
const produitsController = require('../controllers/produitsController'); // Importer le contrôleur
const router = express.Router();

// GET /api/produits - Récupérer tous les produits
router.get('/', produitsController.getAllProduits);

// GET /api/produits/:id - Récupérer un produit par ID
router.get('/:id', validateParams(schemas.id), produitsController.getProduitById);

// POST /api/produits - Créer un nouveau produit
router.post('/', validateBody(schemas.produit), produitsController.createProduit);

// PUT /api/produits/:id - Mettre à jour un produit
router.put('/:id', validateParams(schemas.id), validateBody(schemas.produit), produitsController.updateProduit);

// DELETE /api/produits/:id - Supprimer un produit
router.delete('/:id', validateParams(schemas.id), produitsController.deleteProduit);

// GET /api/produits/categories/liste - Récupérer les catégories disponibles
router.get('/categories/liste', produitsController.getCategories);

module.exports = router;