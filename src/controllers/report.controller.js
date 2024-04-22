import { Report } from '../models/models.js';

// Obtener todos los reportes
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.findAll();
        res.json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los reportes" });
    }
};

// Obtener un reporte por su ID
export const getReportById = async (req, res) => {
    const { id } = req.params;
    try {
        const report = await Report.findByPk(id);
        if (report) {
            res.json(report);
        } else {
            res.status(404).json({ message: "Reporte no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el reporte" });
    }
};

// Crear un nuevo reporte
export const createReport = async (req, res) => {
    const { name, description, version, icon, link, free, confidential, ModuleId } = req.body;
    try {
        const newReport = await Report.create({
            name,
            description,
            version,
            icon,
            link,
            free,
            confidential,
            ModuleId
        });
        res.status(201).json(newReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el reporte" });
    }
};

// Actualizar un reporte existente
export const updateReport = async (req, res) => {
    const { id } = req.params;
    const { name, description, version, icon, link, free, active, confidential, ModuleId } = req.body;
    try {
        const report = await Report.findByPk(id);
        if (report) {
            await report.update({
                name,
                description,
                version,
                icon,
                link,
                free,
                active,
                confidential,
                ModuleId
            });
            res.json(report);
        } else {
            res.status(404).json({ message: "Reporte no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el reporte" });
    }
};

// Eliminar un reporte existente
export const deleteReport = async (req, res) => {
    const { id } = req.params;
    try {
        const report = await Report.findByPk(id);
        if (report) {
            await report.destroy();
            res.json({ message: "Reporte eliminado correctamente" });
        } else {
            res.status(404).json({ message: "Reporte no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el reporte" });
    }
};

export const getReportsByFreeReport = async (req, res) => {
    try {
        const reports = await Report.findAll({
            where: { free: true }
        });
        res.status(200).json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};