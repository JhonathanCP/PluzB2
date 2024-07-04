import { State } from "../models/models.js";

// Obtener todos los RLs
export const getAllStates = async (req, res) => {
    try {
        const states = await State.findAll();
        res.json(states);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los states');
    }
};

