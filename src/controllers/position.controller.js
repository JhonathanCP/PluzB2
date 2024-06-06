import { Position } from "../models/models.js";

// Obtener todas las Positions
export const getAllPositions = async (req, res) => {
    try {
        const positions = await Position.findAll();
        res.json(positions);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las posiciones');
    }
};

// Obtener una Position por ID
export const getPositionById = async (req, res) => {
    const { id } = req.params;
    try {
        const position = await Position.findByPk(id);
        if (position) {
            res.json(position);
        } else {
            res.status(404).send('Position no encontrada');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la posición');
    }
};

// Crear una nueva Position
export const createPosition = async (req, res) => {
    const { name } = req.body;
    try {
        const newPosition = await Position.create({ name });
        res.status(201).json(newPosition);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear la posición');
    }
};

// Actualizar una Position existente
export const updatePosition = async (req, res) => {
    const { id } = req.params;
    const { name, active } = req.body;
    try {
        const position = await Position.findByPk(id);
        if (position) {
            position.name = name;
            position.active = active;
            await position.save();
            res.json(position);
        } else {
            res.status(404).send('Position no encontrada');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar la posición');
    }
};

// Eliminar una Position
export const deletePosition = async (req, res) => {
    const { id } = req.params;
    try {
        const position = await Position.findByPk(id);
        if (position) {
            await position.destroy();
            res.send('Position eliminada');
        } else {
            res.status(404).send('Position no encontrada');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la posición');
    }
};