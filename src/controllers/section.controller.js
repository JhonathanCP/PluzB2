import { Section } from '../models/section.model.js';
import { Client } from '../models/client.model.js';
import { SectionType } from '../models/sectiontype.model.js';

// Crear una nueva sección
export const createSection = async (req, res) => {
    try {
        const { name, percepcion, kpiname, kpivalue, active, clientId, sectionTypeId } = req.body;

        const client = await Client.findByPk(clientId);
        if (!client) {
            return res.status(400).json({ message: "Client not found" });
        }

        const sectionType = await SectionType.findByPk(sectionTypeId);
        if (!sectionType) {
            return res.status(400).json({ message: "Section type not found" });
        }

        const section = await Section.create({ name, percepcion, kpiname, kpivalue, active, clientId, sectionTypeId });
        res.status(201).json(section);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todas las secciones
export const getAllSections = async (req, res) => {
    try {
        const sections = await Section.findAll();
        res.status(200).json(sections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una sección por su ID
export const getSectionById = async (req, res) => {
    try {
        const { id } = req.params;
        const section = await Section.findByPk(id);

        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }

        res.status(200).json(section);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar una sección por su ID
export const updateSection = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, percepcion, kpiname, kpivalue, active, clientId, sectionTypeId } = req.body;

        const section = await Section.findByPk(id);
        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }

        if (clientId) {
            const client = await Client.findByPk(clientId);
            if (!client) {
                return res.status(400).json({ message: "Client not found" });
            }
        }

        if (sectionTypeId) {
            const sectionType = await SectionType.findByPk(sectionTypeId);
            if (!sectionType) {
                return res.status(400).json({ message: "Section type not found" });
            }
        }

        await section.update({ name, percepcion, kpiname, kpivalue, active, clientId, sectionTypeId });
        res.status(200).json(section);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una sección por su ID
export const deleteSection = async (req, res) => {
    try {
        const { id } = req.params;
        const section = await Section.findByPk(id);

        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }

        await section.destroy();
        res.status(200).json({ message: "Section deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
