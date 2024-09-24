// src/controllers/servicesection.controller.js

import { ServiceSection } from '../models/servicesection.model.js';
import { GroupServices } from '../models/groupservices.model.js';
import { SectionType } from '../models/sectiontype.model.js';

// Crear una nueva sección de servicio
export const createServiceSection = async (req, res) => {
    try {
        const { name, active, groupServiceId, sectionTypeId } = req.body;

        // Validar que el servicio de grupo y el tipo de sección existan
        const groupService = await GroupServices.findByPk(groupServiceId);
        const sectionType = await SectionType.findByPk(sectionTypeId);

        if (!groupService) {
            return res.status(404).json({ message: 'Servicio de grupo no encontrado' });
        }
        if (!sectionType) {
            return res.status(404).json({ message: 'Tipo de sección no encontrado' });
        }

        // Crear la sección de servicio
        const newServiceSection = await ServiceSection.create({
            name,
            active,
            groupServiceId,
            sectionTypeId
        });

        res.status(201).json(newServiceSection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todas las secciones de servicio
export const getServiceSections = async (req, res) => {
    try {
        const serviceSections = await ServiceSection.findAll({
            include: [
                { model: GroupServices, as: 'groupService' },  // Incluir el servicio de grupo asociado
                { model: SectionType, as: 'sectionType' }       // Incluir el tipo de sección asociado
            ]
        });
        res.status(200).json(serviceSections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una sola sección de servicio por ID
export const getServiceSectionById = async (req, res) => {
    try {
        const { id } = req.params;
        const serviceSection = await ServiceSection.findByPk(id, {
            include: [
                { model: GroupServices, as: 'groupService' },
                { model: SectionType, as: 'sectionType' }
            ]
        });

        if (!serviceSection) {
            return res.status(404).json({ message: 'Sección de servicio no encontrada' });
        }

        res.status(200).json(serviceSection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar una sección de servicio
export const updateServiceSection = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, active, groupServiceId, sectionTypeId } = req.body;

        // Validar que la sección de servicio exista
        const serviceSection = await ServiceSection.findByPk(id);
        if (!serviceSection) {
            return res.status(404).json({ message: 'Sección de servicio no encontrada' });
        }

        // Validar que el servicio de grupo y el tipo de sección existan
        const groupService = await GroupServices.findByPk(groupServiceId);
        const sectionType = await SectionType.findByPk(sectionTypeId);

        if (!groupService) {
            return res.status(404).json({ message: 'Servicio de grupo no encontrado' });
        }
        if (!sectionType) {
            return res.status(404).json({ message: 'Tipo de sección no encontrado' });
        }

        // Actualizar la sección de servicio
        serviceSection.name = name;
        serviceSection.active = active;
        serviceSection.groupServiceId = groupServiceId;
        serviceSection.sectionTypeId = sectionTypeId;

        await serviceSection.save();
        res.status(200).json(serviceSection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una sección de servicio
export const deleteServiceSection = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que la sección de servicio exista
        const serviceSection = await ServiceSection.findByPk(id);
        if (!serviceSection) {
            return res.status(404).json({ message: 'Sección de servicio no encontrada' });
        }

        await serviceSection.destroy();
        res.status(200).json({ message: 'Sección de servicio eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
