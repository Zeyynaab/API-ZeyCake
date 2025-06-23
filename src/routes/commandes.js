const express = require('express');
const { validateBody, validateParams, schemas } = require('../middleware/validation');
const commandesController = require('../controllers/commandesController'); // Importer le contrôleur
const router = express.Router();

// GET /api/commandes - Récupérer toutes les commandes
router.get('/', commandesController.getAllCommandes);

// GET /api/commandes/:id - Récupérer une commande par ID
router.get('/:id', validateParams(schemas.id), commandesController.getCommandeById);

// POST /api/commandes - Créer une nouvelle commande
router.post('/', validateBody(schemas.commande), commandesController.createCommande);

// PUT /api/commandes/:id/statut - Mettre à jour le statut d'une commande
router.put('/:id/statut', validateParams(schemas.id), commandesController.updateCommandeStatut);

// DELETE /api/commandes/:id - Supprimer une commande
router.delete('/:id', validateParams(schemas.id), commandesController.deleteCommande);

module.exports = router;