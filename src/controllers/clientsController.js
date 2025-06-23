const Client = require('../models/clients');
const Commande = require('../models/commandes');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

// Récupérer tous les clients
exports.getAllClients = async (req, res) => {
    const { recherche, ville } = req.query;

    let where = {};

    if (recherche) {
        const term = `%${recherche.toLowerCase()}%`;
        where = {
            ...where,
            [Op.or]: [
                { nom: { [Op.like]: term } },
                { prenom: { [Op.like]: term } },
                { email: { [Op.like]: term } },
            ]
        };
    }

    const clients = await Client.findAll({ where });

    const filtered = ville
        ? clients.filter(c => {
            const adresse = JSON.parse(c.adresse);
            return adresse.ville.toLowerCase().includes(ville.toLowerCase());
        })
        : clients;

    res.json({
        success: true,
        data: filtered,
        total: filtered.length
    });
};

// Récupérer un client par ID
exports.getClientById = async (req, res) => {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
        return res.status(404).json({ success: false, message: 'Client non trouvé' });
    }

    const commandesClient = await Commande.findAll({ where: { clientId: req.params.id } });

    res.json({
        success: true,
        data: {
            ...client.toJSON(),
            commandes: commandesClient,
            totalCommandes: commandesClient.length
        }
    });
};

// Créer un nouveau client
exports.createClient = async (req, res, next) => {
    try {
        const existing = await Client.findOne({ where: { email: req.body.email } });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Email déjà utilisé' });
        }

        const nouveauClient = await Client.create({
            id: uuidv4(),
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(201).json({ success: true, data: nouveauClient });
    } catch (err) {
        next(err);
    }
};

// Mettre à jour un client
exports.updateClient = async (req, res, next) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) {
            return res.status(404).json({ success: false, message: 'Client non trouvé' });
        }

        const emailExists = await Client.findOne({
            where: {
                email: req.body.email,
                id: { [Op.ne]: req.params.id }
            }
        });

        if (emailExists) {
            return res.status(400).json({ success: false, message: 'Email déjà utilisé' });
        }

        await client.update({
            ...req.body,
            updatedAt: new Date()
        });

        res.json({ success: true, message: 'Client mis à jour', data: client });
    } catch (err) {
        next(err);
    }
};

// Supprimer un client
exports.deleteClient = async (req, res) => {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
        return res.status(404).json({ success: false, message: 'Client non trouvé' });
    }

    const commandesActives = await Commande.findAll({
        where: {
            clientId: req.params.id,
            statut: { [Op.notIn]: ['livree', 'annulee'] }
        }
    });

    if (commandesActives.length > 0) {
        return res.status(400).json({ success: false, message: 'Client a des commandes actives' });
    }

    await client.destroy();

    res.json({ success: true, message: 'Client supprimé' });
};

// Récupérer les commandes d'un client
exports.getClientCommandes = async (req, res) => {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
        return res.status(404).json({ success: false, message: 'Client non trouvé' });
    }

    const commandesClient = await Commande.findAll({ where: { clientId: req.params.id } });

    res.json({
        success: true,
        data: commandesClient,
        total: commandesClient.length
    });
};
