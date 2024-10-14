import { Client } from '../models/client.model.js';
import { Group } from '../models/group.model.js';
import { Location } from '../models/location.model.js';
import { GroupServices } from '../models/groupservices.model.js';

// Crear un nuevo cliente
export const createClient = async (req, res) => {
    try {
        const { name, responsible, dob, politicalParty, ocupation, approvalRate, link, active, groupId, locationId } = req.body;

        // Verificar si el grupo existe
        const group = await Group.findByPk(groupId);
        if (!group) {
            return res.status(400).json({ message: "Group not found" });
        }

        // Verificar si la locación existe
        const location = await Location.findByPk(locationId);
        if (!location) {
            return res.status(400).json({ message: "Location not found" });
        }

        // Crear el cliente con todos los campos nuevos
        const client = await Client.create({ 
            name, 
            responsible, 
            dob, 
            politicalParty, 
            ocupation, 
            approvalRate, 
            link, 
            active, 
            groupId, 
            locationId 
        });
        res.status(201).json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los clientes
export const getAllClients = async (req, res) => {
    try {
        const clients = await Client.findAll({
            include: [
                {
                    model: GroupServices,
                    as: 'groupServices', // Asegúrate de usar el alias correcto definido en las asociaciones
                    through: {
                        attributes: [] // Esto evita que se devuelvan datos de la tabla intermedia
                    }
                }
            ]
        });
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findByPk(id, {
            include: [
                {
                    model: GroupServices,
                    as: 'groupServices', // Usa el alias correcto definido en las asociaciones
                    through: {
                        attributes: [] // Para evitar devolver datos innecesarios de la tabla intermedia
                    }
                }
            ]
        });

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un cliente por su ID
export const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, responsible, dob, politicalParty, ocupation, approvalRate, link, active, groupId, locationId } = req.body;

        const client = await Client.findByPk(id);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        // Verificar si el grupo existe
        if (groupId) {
            const group = await Group.findByPk(groupId);
            if (!group) {
                return res.status(400).json({ message: "Group not found" });
            }
        }

        // Verificar si la locación existe
        if (locationId) {
            const location = await Location.findByPk(locationId);
            if (!location) {
                return res.status(400).json({ message: "Location not found" });
            }
        }

        // Actualizar el cliente con todos los campos nuevos
        await client.update({ 
            name, 
            responsible, 
            dob, 
            politicalParty, 
            ocupation, 
            approvalRate, 
            link, 
            active, 
            groupId, 
            locationId 
        });
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un cliente por su ID
export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findByPk(id);

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        await client.destroy();
        res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};