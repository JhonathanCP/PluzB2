import { MainDependency } from '../models/models.js';

// Crear una nueva MainDependency
export const createMainDependency = async (req, res) => {
    try {
        const { name, description } = req.body;
        const mainDependency = await MainDependency.create({ name, description });
        res.status(201).json(mainDependency);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todas las MainDependencies
export const getAllMainDependencies = async (req, res) => {
    try {
        const mainDependencies = await MainDependency.findAll();
        res.status(200).json(mainDependencies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una MainDependency por ID
export const getMainDependencyById = async (req, res) => {
    try {
        const { id } = req.params;
        const mainDependency = await MainDependency.findByPk(id);
        if (mainDependency) {
            res.status(200).json(mainDependency);
        } else {
            res.status(404).json({ error: 'MainDependency not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar una MainDependency
export const updateMainDependency = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, active } = req.body;
        const mainDependency = await MainDependency.findByPk(id);
        if (mainDependency) {
            await mainDependency.update({ name, description, active });
            res.status(200).json(mainDependency);
        } else {
            res.status(404).json({ error: 'MainDependency not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar una MainDependency
export const deleteMainDependency = async (req, res) => {
    try {
        const { id } = req.params;
        const mainDependency = await MainDependency.findByPk(id);
        if (mainDependency) {
            await mainDependency.destroy();
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'MainDependency not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
