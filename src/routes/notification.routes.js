import { Router } from "express";
import { getAllNotificationsByUser, getNotificationById, createNotification, updateNotificationById, deleteNotificationById,} from "../controllers/notification.controller.js"
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const notificationRouter = Router()

notificationRouter.get('/user/:id', [verifyToken, isAdmin], getAllNotificationsByUser);
notificationRouter.get('/:id', [verifyToken, isAdmin], getNotificationById);
notificationRouter.post('/', [verifyToken, isAdmin], createNotification);
notificationRouter.put('/:id', [verifyToken, isAdmin],updateNotificationById);
notificationRouter.delete('/:id', [verifyToken, isAdmin],deleteNotificationById);

export default notificationRouter;