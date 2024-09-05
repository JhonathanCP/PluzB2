import { Role } from '../models/role.model.js';

// Crear un nuevo rol
export const createRole = async (req, res) => {
    try {
        const { name } = req.body;

        // Verifica que el campo 'name' no esté vacío
        if (!name) {
            return res.status(400).json({ message: "El nombre del rol es requerido." });
        }

        // Crea el rol
        const role = await Role.create({ name });
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los roles
export const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un rol por su ID
export const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findByPk(id);

        if (!role) {
            return res.status(404).json({ message: "Rol no encontrado." });
        }

        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un rol por su ID
export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // Verifica si el rol existe
        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).json({ message: "Rol no encontrado." });
        }

        // Verifica si el campo 'name' está presente
        if (!name) {
            return res.status(400).json({ message: "El nombre del rol es requerido." });
        }

        // Actualiza el rol
        await role.update({ name });
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un rol por su ID
export const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica si el rol existe
        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).json({ message: "Rol no encontrado." });
        }

        // Elimina el rol
        await role.destroy();
        res.status(200).json({ message: "Rol eliminado correctamente." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
