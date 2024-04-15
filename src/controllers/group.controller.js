import { Group } from '../models/models.js';

// Obtener todos los grupos
export const getAllGroups = async (req, res) => {
    try {
        const groups = await Group.findAll();
        res.json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los grupos" });
    }
};

// Obtener un grupo por su ID
export const getGroupById = async (req, res) => {
    const { id } = req.params;
    try {
        const group = await Group.findByPk(id);
        if (group) {
            res.json(group);
        } else {
            res.status(404).json({ message: "Grupo no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el grupo" });
    }
};

// Crear un nuevo grupo
export const createGroup = async (req, res) => {
    const { name, description, icon, free } = req.body;
    try {
        const newGroup = await Group.create({
            name,
            description,
            icon,
            free
        });
        res.status(201).json(newGroup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el grupo" });
    }
};

// Actualizar un grupo existente
export const updateGroup = async (req, res) => {
    const { id } = req.params;
    const { name, description, icon, active, free } = req.body;
    try {
        const group = await Group.findByPk(id);
        if (group) {
            await group.update({
                name,
                description,
                icon,
                free,
                active
            });
            res.json(group);
        } else {
            res.status(404).json({ message: "Grupo no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el grupo" });
    }
};

// Eliminar un grupo existente
export const deleteGroup = async (req, res) => {
    const { id } = req.params;
    try {
        const group = await Group.findByPk(id);
        if (group) {
            await group.destroy();
            res.json({ message: "Grupo eliminado correctamente" });
        } else {
            res.status(404).json({ message: "Grupo no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el grupo" });
    }
};
