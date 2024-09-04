import { SectionType } from '../models/sectiontype.model.js';

// Crear un nuevo tipo de sección
export const createSectionType = async (req, res) => {
    try {
        const { name, active } = req.body;

        const sectionType = await SectionType.create({ name, active });
        res.status(201).json(sectionType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los tipos de secciones
export const getAllSectionTypes = async (req, res) => {
    try {
        const sectionTypes = await SectionType.findAll();
        res.status(200).json(sectionTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un tipo de sección por su ID
export const getSectionTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const sectionType = await SectionType.findByPk(id);

        if (!sectionType) {
            return res.status(404).json({ message: "Section type not found" });
        }

        res.status(200).json(sectionType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un tipo de sección por su ID
export const updateSectionType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, active } = req.body;

        const sectionType = await SectionType.findByPk(id);
        if (!sectionType) {
            return res.status(404).json({ message: "Section type not found" });
        }

        await sectionType.update({ name, active });
        res.status(200).json(sectionType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un tipo de sección por su ID
export const deleteSectionType = async (req, res) => {
    try {
        const { id } = req.params;
        const sectionType = await SectionType.findByPk(id);

        if (!sectionType) {
            return res.status(404).json({ message: "Section type not found" });
        }

        await sectionType.destroy();
        res.status(200).json({ message: "Section type deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
