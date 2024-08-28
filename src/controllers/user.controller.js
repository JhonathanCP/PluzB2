import { User } from '../models/user.model.js';
import { Role } from '../models/role.model.js';

// Crear un nuevo usuario
export const createUser = async (req, res) => {
    try {
        const { username, email, password, roleId } = req.body;

        // Verifica si el rol existe
        const role = await Role.findByPk(roleId);
        if (!role) {
            return res.status(400).json({ message: "Role not found" });
        }

        // Crea el usuario
        const user = await User.create({ username, email, password, roleId });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: {
                model: Role,
                as: 'role',
                attributes: ['name'] // Solo traer el nombre del rol
            }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un usuario por su ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            include: {
                model: Role,
                as: 'role',
                attributes: ['name']
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un usuario por su ID
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, roleId } = req.body;

        // Verifica si el usuario existe
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verifica si el rol existe
        if (roleId) {
            const role = await Role.findByPk(roleId);
            if (!role) {
                return res.status(400).json({ message: "Role not found" });
            }
        }

        // Actualiza el usuario
        await user.update({ username, email, password, roleId });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un usuario por su ID
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica si el usuario existe
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Elimina el usuario
        await user.destroy();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
