import { Router } from "express";
import { createUser, getUserById, updateUser, getAllUsers, getModulesByUser, getReportsByUser, addAllData, createUserModule, createUserReport, deleteUserModule, deleteUserReport, addFavorite, getFavorites, removeFavorite } from "../controllers/user.controller.js"
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const userRouter = Router()

userRouter.get('/', [verifyToken, isAdmin], getAllUsers);
userRouter.get('/:id', [verifyToken], getUserById);
userRouter.put('/:id', [verifyToken], updateUser);
userRouter.get('/:id/get-modules', [verifyToken], getModulesByUser);
userRouter.get('/:id/get-reports', [verifyToken], getReportsByUser);
userRouter.post('/', [verifyToken, isAdmin], createUser);
userRouter.post('/favorites', [verifyToken, isAdmin], addFavorite);
userRouter.delete('/favorites', [verifyToken, isAdmin], removeFavorite);
userRouter.get('/favorites/:id', [verifyToken], getFavorites);
userRouter.post('/:id/add-all', [verifyToken, isAdmin], addAllData);
userRouter.post('/add-module', [verifyToken, isAdmin], createUserModule);
userRouter.post('/add-report', [verifyToken, isAdmin], createUserReport);
userRouter.delete('/delete-module', [verifyToken, isAdmin], deleteUserModule);
userRouter.delete('/:userId/delete-report/:reportId', [verifyToken, isAdmin], deleteUserReport);

export default userRouter;