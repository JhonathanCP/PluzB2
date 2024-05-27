import { Router } from "express";
import { createUser, getUserById, getAllUsers, getGroupsByUser, getModulesByUser, getReportsByUser, addAllData, createUserGroup, createUserModule, createUserReport, deleteUserGroup, deleteUserModule, deleteUserReport } from "../controllers/user.controller.js"
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const userRouter = Router()

userRouter.get('/', [verifyToken, isAdmin], getAllUsers);
userRouter.get('/:id', [verifyToken, isAdmin], getUserById);
userRouter.get('/:id/get-groups', [verifyToken], getGroupsByUser);
userRouter.get('/:id/get-modules', [verifyToken], getModulesByUser);
userRouter.get('/:id/get-reports', [verifyToken], getReportsByUser);
userRouter.post('/', [verifyToken, isAdmin], createUser);
userRouter.post('/:id/add-all', [verifyToken, isAdmin], addAllData);
userRouter.post('/add-group', [verifyToken, isAdmin], createUserGroup);
userRouter.post('/add-module', [verifyToken, isAdmin], createUserModule);
userRouter.post('/add-report', [verifyToken, isAdmin], createUserReport);
userRouter.delete('/delete-group', [verifyToken, isAdmin], deleteUserGroup);
userRouter.delete('/delete-module', [verifyToken, isAdmin], deleteUserModule);
userRouter.delete('/:userId/delete-report/:reportId', [verifyToken, isAdmin], deleteUserReport);

export default userRouter;