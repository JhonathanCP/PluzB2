import { Group } from '../models/group.model.js';
import { Client } from '../models/client.model.js';

// Crear un nuevo grupo
export const createGroup = async (req, res) => {
    try {
        const { name, description, icon, active } = req.body;
        const group = await Group.create({ name, description, icon, active });
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los grupos
export const getAllGroups = async (req, res) => {
    try {
        const groups = await Group.findAll();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un grupo por su ID
export const getGroupById = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Group.findByPk(id);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un grupo por su ID
export const updateGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, icon, active } = req.body;

        const group = await Group.findByPk(id);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        await group.update({ name, description, icon, active });
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un grupo por su ID
export const deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Group.findByPk(id);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        await group.destroy();
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
