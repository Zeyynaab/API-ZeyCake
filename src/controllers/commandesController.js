const { commandes, clients, produits, generateId } = require('../data/database');

// Récupérer toutes les commandes
exports.getAllCommandes = (req, res) => {
    const { statut, clientId, dateDebut, dateFin } = req.query;

    let filteredCommandes = [...commandes];

    // Filtrer par statut
    if (statut) {
        filteredCommandes = filteredCommandes.filter(c => c.statut === statut);
    }

    // Filtrer par client
    if (clientId) {
        filteredCommandes = filteredCommandes.filter(c => c.clientId === clientId);
    }

    // Filtrer par date
    if (dateDebut) {
        filteredCommandes = filteredCommandes.filter(c =>
            new Date(c.dateCommande) >= new Date(dateDebut)
        );
    }
    if (dateFin) {
        filteredCommandes = filteredCommandes.filter(c =>
            new Date(c.dateCommande) <= new Date(dateFin)
        );
    }

    // Enrichir avec les informations des clients et produits
    const enrichedCommandes = filteredCommandes.map(commande => {
        const client = clients.find(c => c.id === commande.clientId);
        const produitsDetails = commande.produits.map(item => {
            const produit = produits.find(p => p.id === item.produitId);
            return {
                ...item,
                produit: produit || null,
            };
        });
        return {
            ...commande,
            client: client || null,
            produits: produitsDetails,
        };
    });

    res.json({
        success: true,
        data: enrichedCommandes,
        total: enrichedCommandes.length,
    });
};

// Récupérer une commande par ID
exports.getCommandeById = (req, res) => {
    const commande = commandes.find(c => c.id === req.params.id);
    if (!commande) {
        return res.status(404).json({
            success: false,
            message: 'Commande non trouvée',
        });
    }

    // Enrichir avec les informations du client et des produits
    const client = clients.find(c => c.id === commande.clientId);
    const produitsDetails = commande.produits.map(item => {
        const produit = produits.find(p => p.id === item.produitId);
        return {
            ...item,
            produit: produit || null,
        };
    });

    const enrichedCommande = {
        ...commande,
        client: client || null,
        produits: produitsDetails,
    };

    res.json({
        success: true,
        data: enrichedCommande,
    });
};

// Créer une nouvelle commande
exports.createCommande = (req, res, next) => {
    try {
        const { clientId, produits: produitsCommande, dateRecuperation, commentaires } = req.body;

        // Vérifier que le client existe
        const client = clients.find(c => c.id === clientId);
        if (!client) {
            return res.status(400).json({
                success: false,
                message: 'Client non trouvé',
            });
        }

        // Vérifier que tous les produits existent et calculer le total
        let total = 0;
        const produitsValides = [];

        for (const item of produitsCommande) {
            const produit = produits.find(p => p.id === item.produitId);
            if (!produit) {
                return res.status(400).json({
                    success: false,
                    message: `Produit avec l'ID ${item.produitId} non trouvé`,
                });
            }
            if (!produit.disponible) {
                return res.status(400).json({
                    success: false,
                    message: `Le produit "${produit.nom}" n'est pas disponible`,
                });
            }
            total += produit.prix * item.quantite;
            produitsValides.push({
                produitId: item.produitId,
                quantite: item.quantite,
                prixUnitaire: produit.prix,
                personnalisation: item.personnalisation || '',
            });
        }

        const nouvelleCommande = {
            id: generateId(),
            clientId,
            produits: produitsValides,
            dateCommande: new Date(),
            dateRecuperation: new Date(dateRecuperation),
            statut: 'en-attente',
            total: parseFloat(total.toFixed(2)),
            commentaires: commentaires || '',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        commandes.push(nouvelleCommande);
        res.status(201).json({
            success: true,
            message: 'Commande créée avec succès',
            data: nouvelleCommande,
        });
    } catch (error) {
        next(error);
    }
};

// Mettre à jour le statut d'une commande
exports.updateCommandeStatut = (req, res, next) => {
    try {
        const { statut } = req.body;
        const statutsValides = ['en-attente', 'confirmee', 'en-preparation', 'prete', 'livree', 'annulee'];

        if (!statut || !statutsValides.includes(statut)) {
            return res.status(400).json({
                success: false,
                message: `Statut invalide. Statuts valides: ${statutsValides.join(', ')}`,
            });
        }

        const index = commandes.findIndex(c => c.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Commande non trouvée',
            });
        }

        commandes[index].statut = statut;
        commandes[index].updatedAt = new Date();

        res.json({
            success: true,
            message: 'Statut de la commande mis à jour avec succès',
            data: commandes[index],
        });
    } catch (error) {
        next(error);
    }
};

// Supprimer une commande
exports.deleteCommande = (req, res) => {
    const index = commandes.findIndex(c => c.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Commande non trouvée',
        });
    }

    // Seules les commandes en attente peuvent être supprimées
    if (commandes[index].statut !== 'en-attente') {
        return res.status(400).json({
            success: false,
            message: 'Seules les commandes en attente peuvent être supprimées',
        });
    }

    const commandeSupprimee = commandes.splice(index, 1);

    res.json({
        success: true,
        message: 'Commande supprimée avec succès',
        data: commandeSupprimee,
    });
};