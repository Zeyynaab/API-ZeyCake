const express = require('express');
const { validateBody, validateParams, schemas } = require('../middleware/validation');
const ingredientsController = require('../controllers/ingredientsController'); // Importer le contrôleur
const router = express.Router();

// GET /api/ingredients - Récupérer tous les ingrédients
router.get('/', ingredientsController.getAllIngredients);

// GET /api/ingredients/:id - Récupérer un ingrédient par ID
router.get('/:id', validateParams(schemas.id), ingredientsController.getIngredientById);

// POST /api/ingredients - Créer un nouvel ingrédient
router.post('/', validateBody(schemas.ingredient), ingredientsController.createIngredient);

// PUT /api/ingredients/:id - Mettre à jour un ingrédient
router.put('/:id', validateParams(schemas.id), validateBody(schemas.ingredient), ingredientsController.updateIngredient);

// PUT /api/ingredients/:id/stock - Mettre à jour le stock d'un ingrédient
router.put('/:id/stock', validateParams(schemas.id), ingredientsController.updateIngredientStock);

// DELETE /api/ingredients/:id - Supprimer un ingrédient
router.delete('/:id', validateParams(schemas.id), ingredientsController.deleteIngredient);

// GET /api/ingredients/alertes/stock - Récupérer les alertes de stock
router.get('/alertes/stock', ingredientsController.getAlertesStock);

module.exports = router;