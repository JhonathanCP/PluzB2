import { Dependency } from '../models/models.js';

// Crear una nueva Dependency
export const createDependency = async (req, res) => {
    try {
        const { name, description, MainDependencyId } = req.body;
        const dependency = await Dependency.create({ name, description, MainDependencyId: MainDependencyId });
        res.status(201).json(dependency);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todas las Dependencies
export const getAllDependencies = async (req, res) => {
    try {
        const dependencies = await Dependency.findAll();
        res.status(200).json(dependencies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una Dependency por ID
export const getDependencyById = async (req, res) => {
    try {
        const { id } = req.params;
        const dependency = await Dependency.findByPk(id);
        if (dependency) {
            res.status(200).json(dependency);
        } else {
            res.status(404).json({ error: 'Dependency not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar una Dependency
export const updateDependency = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, active, mainDependencyId } = req.body;
        const dependency = await Dependency.findByPk(id);
        if (dependency) {
            await dependency.update({ name, description, active, MainDependencyId: mainDependencyId });
            res.status(200).json(dependency);
        } else {
            res.status(404).json({ error: 'Dependency not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar una Dependency
export const deleteDependency = async (req, res) => {
    try {
        const { id } = req.params;
        const dependency = await Dependency.findByPk(id);
        if (dependency) {
            await dependency.destroy();
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Dependency not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
