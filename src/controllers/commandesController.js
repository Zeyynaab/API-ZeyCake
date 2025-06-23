const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const Commande = require('../models/commandes');
const Client = require('../models/clients');
const Produit = require('../models/produits');

// Récupérer toutes les commandes
exports.getAllCommandes = async (req, res) => {
    const { statut, clientId, dateDebut, dateFin } = req.query;

    let where = {};

    if (statut) where.statut = statut;
    if (clientId) where.clientId = clientId;
    if (dateDebut || dateFin) {
        where.dateCommande = {};
        if (dateDebut) where.dateCommande[Op.gte] = new Date(dateDebut);
        if (dateFin) where.dateCommande[Op.lte] = new Date(dateFin);
    }

    const commandes = await Commande.findAll({ where });

    const enriched = await Promise.all(commandes.map(async (cmd) => {
        const client = await Client.findByPk(cmd.clientId);
        const produitsCommandes = JSON.parse(cmd.produits);
        const produitsDetails = await Promise.all(produitsCommandes.map(async (p) => {
            const produit = await Produit.findByPk(p.produitId);
            return {
                ...p,
                produit: produit || null
            };
        }));
        return {
            ...cmd.toJSON(),
            client,
            produits: produitsDetails
        };
    }));

    res.json({
        success: true,
        data: enriched,
        total: enriched.length
    });
};

// Récupérer une commande par ID
exports.getCommandeById = async (req, res) => {
    const commande = await Commande.findByPk(req.params.id);
    if (!commande) {
        return res.status(404).json({ success: false, message: 'Commande non trouvée' });
    }

    const client = await Client.findByPk(commande.clientId);
    const produitsCommandes = JSON.parse(commande.produits);
    const produitsDetails = await Promise.all(produitsCommandes.map(async (p) => {
        const produit = await Produit.findByPk(p.produitId);
        return { ...p, produit: produit || null };
    }));

    res.json({
        success: true,
        data: {
            ...commande.toJSON(),
            client,
            produits: produitsDetails
        }
    });
};

// Créer une nouvelle commande
exports.createCommande = async (req, res, next) => {
    try {
        const { clientId, produits, dateRecuperation, commentaires } = req.body;

        const client = await Client.findByPk(clientId);
        if (!client) {
            return res.status(400).json({ success: false, message: 'Client non trouvé' });
        }

        let total = 0;
        const produitsValides = [];

        for (const item of produits) {
            const produit = await Produit.findByPk(item.produitId);
            if (!produit) {
                return res.status(400).json({
                    success: false,
                    message: `Produit ${item.produitId} introuvable`
                });
            }
            if (!produit.disponible) {
                return res.status(400).json({
                    success: false,
                    message: `Produit "${produit.nom}" non disponible`
                });
            }
            total += produit.prix * item.quantite;
            produitsValides.push({
                produitId: item.produitId,
                quantite: item.quantite,
                prixUnitaire: produit.prix,
                personnalisation: item.personnalisation || ''
            });
        }

        const commande = await Commande.create({
            id: uuidv4(),
            clientId,
            produits: JSON.stringify(produitsValides),
            dateCommande: new Date(),
            dateRecuperation: new Date(dateRecuperation),
            statut: 'en-attente',
            total: parseFloat(total.toFixed(2)),
            commentaires,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(201).json({ success: true, data: commande });
    } catch (err) {
        next(err);
    }
};

// Mettre à jour le statut d'une commande
exports.updateCommandeStatut = async (req, res, next) => {
    try {
        const { statut } = req.body;
        const valides = ['en-attente', 'confirmee', 'en-preparation', 'prete', 'livree', 'annulee'];

        if (!statut || !valides.includes(statut)) {
            return res.status(400).json({ success: false, message: `Statut invalide. Valides: ${valides.join(', ')}` });
        }

        const commande = await Commande.findByPk(req.params.id);
        if (!commande) {
            return res.status(404).json({ success: false, message: 'Commande non trouvée' });
        }

        await commande.update({ statut, updatedAt: new Date() });

        res.json({ success: true, message: 'Statut mis à jour', data: commande });
    } catch (err) {
        next(err);
    }
};

// Supprimer une commande
exports.deleteCommande = async (req, res) => {
    const commande = await Commande.findByPk(req.params.id);
    if (!commande) {
        return res.status(404).json({ success: false, message: 'Commande non trouvée' });
    }

    if (commande.statut !== 'en-attente') {
        return res.status(400).json({ success: false, message: 'Seules les commandes en attente peuvent être supprimées' });
    }

    await commande.destroy();

    res.json({ success: true, message: 'Commande supprimée avec succès' });
};
