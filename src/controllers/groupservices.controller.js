import { GroupServices } from '../models/groupservices.model.js'; // Asegúrate de que el modelo esté en la ruta correcta
import { Group } from '../models/group.model.js'; // Asumiendo que tienes un modelo de Group

// Crear un nuevo servicio para un grupo
export const createGroupService = async (req, res) => {
    try {
        const { groupId, name, description, active } = req.body;

        // Verificar si el grupo existe
        const group = await Group.findByPk(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Grupo no encontrado' });
        }

        // Crear el nuevo servicio del grupo
        const groupService = await GroupServices.create({
            name,
            description,
            active,
            groupId
        });

        res.status(201).json(groupService);
    } catch (error) {
        res.status(500).json({ message: 'Error creando el servicio de grupo', error: error.message });
    }
};

// Obtener todos los servicios de grupo
export const getAllGroupServices = async (req, res) => {
    try {
        const groupServices = await GroupServices.findAll({
            include: [Group] // Incluir los detalles del grupo
        });

        res.status(200).json(groupServices);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo los servicios de grupo', error: error.message });
    }
};

// Obtener un servicio de grupo por ID
export const getGroupServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const groupService = await GroupServices.findByPk(id, {
            include: [Group] // Incluir los detalles del grupo
        });

        if (!groupService) {
            return res.status(404).json({ message: 'Servicio de grupo no encontrado' });
        }

        res.status(200).json(groupService);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo el servicio de grupo', error: error.message });
    }
};

// Actualizar un servicio de grupo
export const updateGroupService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, active, groupId } = req.body;

        // Verificar si el servicio de grupo existe
        const groupService = await GroupServices.findByPk(id);
        if (!groupService) {
            return res.status(404).json({ message: 'Servicio de grupo no encontrado' });
        }

        // Actualizar los datos del servicio de grupo
        await groupService.update({ name, description, active, groupId });

        res.status(200).json(groupService);
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando el servicio de grupo', error: error.message });
    }
};

// Eliminar un servicio de grupo
export const deleteGroupService = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el servicio de grupo existe
        const groupService = await GroupServices.findByPk(id);
        if (!groupService) {
            return res.status(404).json({ message: 'Servicio de grupo no encontrado' });
        }

        // Eliminar el servicio de grupo
        await groupService.destroy();

        res.status(200).json({ message: 'Servicio de grupo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error eliminando el servicio de grupo', error: error.message });
    }
};
