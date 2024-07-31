import { Router } from "express";
import { getAllNotificationsByUser, getNotificationById, createNotification, updateNotificationById, deleteNotificationById,} from "../controllers/notification.controller.js"
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const notificationRouter = Router()

notificationRouter.get('/user/:id', [verifyToken], getAllNotificationsByUser);
notificationRouter.get('/:id', [verifyToken], getNotificationById);
notificationRouter.post('/', [verifyToken], createNotification);
notificationRouter.put('/:id', [verifyToken],updateNotificationById);
notificationRouter.delete('/:id', [verifyToken],deleteNotificationById);

export default notificationRouter;