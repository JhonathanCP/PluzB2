import { Router } from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, recoverPassword } from '../controllers/user.controller.js';
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const userRouter = Router();

// Rutas para las operaciones CRUD
userRouter.post('/',[verifyToken, isAdmin], createUser);         // Crear un nuevo usuario
userRouter.get('/',[verifyToken, isAdmin], getAllUsers);         // Obtener todos los usuarios
userRouter.get('/:id',[verifyToken], getUserById);      // Obtener un usuario por su ID
userRouter.put('/:id',[verifyToken], updateUser);       // Actualizar un usuario por su ID
userRouter.delete('/:id',[verifyToken, isAdmin], deleteUser);    // Eliminar un usuario por su ID
userRouter.post('/:id/recover-password', recoverPassword);

export default userRouter;
