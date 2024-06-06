import { RL } from "../models/models.js";

// Obtener todos los RLs
export const getAllRLs = async (req, res) => {
    try {
        const rls = await RL.findAll();
        res.json(rls);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los RLs');
    }
};

// Obtener un RL por ID
export const getRLById = async (req, res) => {
    const { id } = req.params;
    try {
        const rl = await RL.findByPk(id);
        if (rl) {
            res.json(rl);
        } else {
            res.status(404).send('RL no encontrado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el RL');
    }
};

// Crear un nuevo RL
export const createRL = async (req, res) => {
    const { name } = req.body;
    try {
        const newRL = await RL.create({ name });
        res.status(201).json(newRL);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el RL');
    }
};

// Actualizar un RL existente
export const updateRL = async (req, res) => {
    const { id } = req.params;
    const { name, active } = req.body;
    try {
        const rl = await RL.findByPk(id);
        if (rl) {
            rl.name = name;
            rl.active = active;
            await rl.save();
            res.json(rl);
        } else {
            res.status(404).send('RL no encontrado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar el RL');
    }
};

// Eliminar un RL
export const deleteRL = async (req, res) => {
    const { id } = req.params;
    try {
        const rl = await RL.findByPk(id);
        if (rl) {
            await rl.destroy();
            res.send('RL eliminado');
        } else {
            res.status(404).send('RL no encontrado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el RL');
    }
};
