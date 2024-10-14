import { ServiceProfile } from '../models/serviceprofile.model.js';
import { GroupServices } from '../models/groupservices.model.js';

// Crear un nuevo perfil de servicio
export const createServiceProfile = async (req, res) => {
    try {
        const { name, description, active, groupServiceId } = req.body;

        // Verifica si el servicio de grupo existe
        const groupService = await GroupServices.findByPk(groupServiceId);
        if (!groupService) {
            return res.status(400).json({ message: "Group service not found" });
        }

        // Crear el perfil de servicio
        const serviceProfile = await ServiceProfile.create({ name, description, active, groupServiceId });
        res.status(201).json(serviceProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los perfiles de servicio
export const getAllServiceProfiles = async (req, res) => {
    try {
        // Incluir el servicio de grupo relacionado
        const serviceProfiles = await ServiceProfile.findAll();
        res.status(200).json(serviceProfiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un perfil de servicio por su ID
export const getServiceProfileById = async (req, res) => {
    try {
        const { id } = req.params;

        // Incluir el servicio de grupo relacionado
        const serviceProfile = await ServiceProfile.findByPk(id);

        if (!serviceProfile) {
            return res.status(404).json({ message: "Service profile not found" });
        }

        res.status(200).json(serviceProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un perfil de servicio por su ID
export const updateServiceProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, active, groupServiceId } = req.body;

        // Verifica si el perfil de servicio existe
        const serviceProfile = await ServiceProfile.findByPk(id);
        if (!serviceProfile) {
            return res.status(404).json({ message: "Service profile not found" });
        }

        // Verifica si el servicio de grupo existe
        if (groupServiceId) {
            const groupService = await GroupServices.findByPk(groupServiceId);
            if (!groupService) {
                return res.status(400).json({ message: "Group service not found" });
            }
        }

        // Actualizar el perfil de servicio
        await serviceProfile.update({ name, description, active, groupServiceId });
        res.status(200).json(serviceProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un perfil de servicio por su ID
export const deleteServiceProfile = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica si el perfil de servicio existe
        const serviceProfile = await ServiceProfile.findByPk(id);
        if (!serviceProfile) {
            return res.status(404).json({ message: "Service profile not found" });
        }

        // Eliminar el perfil de servicio
        await serviceProfile.destroy();
        res.status(200).json({ message: "Service profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
