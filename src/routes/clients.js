const express = require('express');
const { validateBody, validateParams, schemas } = require('../middleware/validation');
const clientsController = require('../controllers/clientsController'); // Importer le contrôleur
const router = express.Router();

// GET /api/clients - Récupérer tous les clients
router.get('/', clientsController.getAllClients);

// GET /api/clients/:id - Récupérer un client par ID
router.get('/:id', validateParams(schemas.id), clientsController.getClientById);

// POST /api/clients - Créer un nouveau client
router.post('/', validateBody(schemas.client), clientsController.createClient);

// PUT /api/clients/:id - Mettre à jour un client
router.put('/:id', validateParams(schemas.id), validateBody(schemas.client), clientsController.updateClient);

// DELETE /api/clients/:id - Supprimer un client
router.delete('/:id', validateParams(schemas.id), clientsController.deleteClient);

// GET /api/clients/:id/commandes - Récupérer les commandes d'un client
router.get('/:id/commandes', validateParams(schemas.id), clientsController.getClientCommandes);

module.exports = router;