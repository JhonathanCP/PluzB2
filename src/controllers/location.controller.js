import { Location } from '../models/location.model.js';
import { Client } from '../models/client.model.js';

// Crear una nueva ubicación
export const createLocation = async (req, res) => {
    try {
        const { name, code, responsible, active } = req.body;

        const location = await Location.create({ name, code, responsible, active });
        res.status(201).json(location);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todas las ubicaciones
export const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.findAll();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una ubicación por su ID
export const getLocationById = async (req, res) => {
    try {
        const { id } = req.params;
        const location = await Location.findByPk(id);

        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar una ubicación por su ID
export const updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, responsible, active } = req.body;

        const location = await Location.findByPk(id);
        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        await location.update({ name, code, responsible, active });
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una ubicación por su ID
export const deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const location = await Location.findByPk(id);

        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        await location.destroy();
        res.status(200).json({ message: "Location deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
