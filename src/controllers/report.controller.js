import { Report, Notification, User, Module } from "../models/models.js"; // Importa User y Module para utilizarlos en la consulta a UserModule
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

export const createReport = async (req, res) => {
    const { name, description, version, icon, link, free, limited, restricted, ModuleId } = req.body;
    try {
        const newReport = await Report.create({
            name,
            description,
            version,
            icon,
            link,
            free,
            limited,
            restricted,
            confidential,
            ModuleId
        });

        // Notificar a todos los usuarios que tienen permiso en el ModuleId
        const usersWithPermission = await User.findAll({
            include: {
                model: Module,
                where: { id: ModuleId }
            }
        });

        const notificationPromises = usersWithPermission.map(async (user) => {
            await Notification.create({
                UserId: user.id,
                name: 'Nuevo reporte',
                shortDescription: `Nuevo reporte ${name} creado en el módulo ${ModuleId}`,
                description: description
            });
        });

        await Promise.all(notificationPromises);

        res.status(201).json(newReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el reporte" });
    }
};

export const updateReport = async (req, res) => {
    const { id } = req.params;
    const { name, description, version, icon, link, free, active, confidential, ModuleId } = req.body;
    try {
        const report = await Report.findByPk(id);
        if (report) {
            const TempModuleId = report.ModuleId;
            const TempName = report.name;

            // Notificar a todos los usuarios que tienen permiso en el ModuleId sobre la actualización del reporte
            const usersWithPermission = await User.findAll({
                include: {
                    model: Module,
                    where: { id: TempModuleId }
                }
            });

            const updatedReport = await report.update({
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

            const notificationPromises = usersWithPermission.map(async (user) => {
                await Notification.create({
                    UserId: user.id,
                    name: 'Cambios en reporte',
                    shortDescription: `El reporte ${TempName} ha sido actualizado en el módulo ${TempModuleId}`
                });
            });

            await Promise.all(notificationPromises);

            res.json(updatedReport);
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