import { Notification } from "../models/models.js";

// Crear una nueva notificación
export const createNotification = async (req, res) => {
    try {
        const { name, description, link, UserId } = req.body;
        const newNotification = await Notification.create({
            name,
            description,
            link,
            UserId
        });
        res.status(201).json({ notification: newNotification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear la notificación" });
    }
};

// Obtener todas las notificaciones de un usuario
export const getAllNotificationsByUser = async (req, res) => {
    const { id } = req.params;
    try {
        const notifications = await Notification.findAll({
            where: { UserId: id }
        });
        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las notificaciones del usuario" });
    }
};

// Obtener una notificación por su ID
export const getNotificationById = async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await Notification.findByPk(id);
        if (notification) {
            res.json(notification);
        } else {
            res.status(404).json({ message: "Notificación no encontrada" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener la notificación" });
    }
};

// Actualizar una notificación por su ID
export const updateNotificationById = async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await Notification.findByPk(id);
        if (notification) {
            const { name, description, link, opened, hidden, openedAt } = req.body;
            await notification.update({
                name: name || notification.name,
                description: description || notification.description,
                link: link || notification.link,
                opened: opened || notification.opened,
                hidden: hidden || notification.hidden,
                openedAt: openedAt || notification.openedAt
            });
            res.json({ notification });
        } else {
            res.status(404).json({ message: "Notificación no encontrada" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar la notificación" });
    }
};

// Eliminar una notificación por su ID
export const deleteNotificationById = async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await Notification.findByPk(id);
        if (notification) {
            await notification.destroy();
            res.json({ message: "Notificación eliminada correctamente" });
        } else {
            res.status(404).json({ message: "Notificación no encontrada" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar la notificación" });
    }
};
