import { Client } from '../models/client.model.js';
import { Group } from '../models/group.model.js';
import { Section } from '../models/section.model.js';

// Crear un nuevo cliente
export const createClient = async (req, res) => {
    try {
        const { name, description, responsible, active, groupId } = req.body;

        const group = await Group.findByPk(groupId);
        if (!group) {
            return res.status(400).json({ message: "Group not found" });
        }

        const client = await Client.create({ name, description, responsible, active, groupId });
        res.status(201).json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los clientes
export const getAllClients = async (req, res) => {
    try {
        const clients = await Client.findAll();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un cliente por su ID
export const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findByPk(id);

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
        const { name, description, responsible, active, groupId } = req.body;

        const client = await Client.findByPk(id);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        if (groupId) {
            const group = await Group.findByPk(groupId);
            if (!group) {
                return res.status(400).json({ message: "Group not found" });
            }
        }

        await client.update({ name, description, responsible, active, groupId });
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
