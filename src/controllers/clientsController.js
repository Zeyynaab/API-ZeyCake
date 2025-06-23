const { clients, commandes, generateId } = require('../data/database');

// Récupérer tous les clients
exports.getAllClients = (req, res) => {
    const { recherche, ville } = req.query;

    let filteredClients = [...clients];

    // Recherche par nom, prénom ou email
    if (recherche) {
        const searchTerm = recherche.toLowerCase();
        filteredClients = filteredClients.filter(c =>
            c.nom.toLowerCase().includes(searchTerm) ||
            c.prenom.toLowerCase().includes(searchTerm) ||
            c.email.toLowerCase().includes(searchTerm)
        );
    }

    // Filtrer par ville
    if (ville) {
        filteredClients = filteredClients.filter(c =>
            c.adresse.ville.toLowerCase().includes(ville.toLowerCase())
        );
    }

    res.json({
        success: true,
        data: filteredClients,
        total: filteredClients.length,
    });
};

// Récupérer un client par ID
exports.getClientById = (req, res) => {
    const client = clients.find(c => c.id === req.params.id);
    if (!client) {
        return res.status(404).json({
            success: false,
            message: 'Client non trouvé',
        });
    }

    // Ajouter l'historique des commandes
    const commandesClient = commandes.filter(cmd => cmd.clientId === client.id);
    res.json({
        success: true,
        data: {
            ...client,
            commandes: commandesClient,
            totalCommandes: commandesClient.length,
        },
    });
};

// Créer un nouveau client
exports.createClient = (req, res, next) => {
    try {
        // Vérifier si l'email existe déjà
        const existingClient = clients.find(c => c.email === req.body.email);
        if (existingClient) {
            return res.status(400).json({
                success: false,
                message: 'Un client avec cet email existe déjà',
            });
        }

        const nouveauClient = {
            id: generateId(),
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        clients.push(nouveauClient);
        res.status(201).json({
            success: true,
            message: 'Client créé avec succès',
            data: nouveauClient,
        });
    } catch (error) {
        next(error);
    }
};

// Mettre à jour un client
exports.updateClient = (req, res, next) => {
    try {
        const index = clients.findIndex(c => c.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Client non trouvé',
            });
        }

        // Vérifier si l'email existe déjà (sauf pour le client actuel)
        const existingClient = clients.find(c => c.email === req.body.email && c.id !== req.params.id);
        if (existingClient) {
            return res.status(400).json({
                success: false,
                message: 'Un autre client avec cet email existe déjà',
            });
        }

        clients[index] = {
            ...clients[index],
            ...req.body,
            updatedAt: new Date(),
        };

        res.json({
            success: true,
            message: 'Client mis à jour avec succès',
            data: clients[index],
        });
    } catch (error) {
        next(error);
    }
};

// Supprimer un client
exports.deleteClient = (req, res) => {
    const index = clients.findIndex(c => c.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Client non trouvé',
        });
    }

    // Vérifier s'il y a des commandes actives
    const commandesActives = commandes.filter(cmd =>
        cmd.clientId === req.params.id &&
        !['livree', 'annulee'].includes(cmd.statut)
    );

    if (commandesActives.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Impossible de supprimer un client avec des commandes actives',
        });
    }

    const clientSupprime = clients.splice(index, 1);

    res.json({
        success: true,
        message: 'Client supprimé avec succès',
        data: clientSupprime,
    });
};

// Récupérer les commandes d'un client
exports.getClientCommandes = (req, res) => {
    const client = clients.find(c => c.id === req.params.id);
    if (!client) {
        return res.status(404).json({
            success: false,
            message: 'Client non trouvé',
        });
    }

    const commandesClient = commandes.filter(cmd => cmd.clientId === req.params.id);
    res.json({
        success: true,
        data: commandesClient,
        total: commandesClient.length,
    });
};