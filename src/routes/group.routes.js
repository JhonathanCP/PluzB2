import { Router } from 'express';
import { createGroup, getAllGroups, getGroupById, updateGroup, deleteGroup } from '../controllers/group.controller.js';
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const groupRouter = Router();

// Rutas para las operaciones CRUD
groupRouter.post('/',[verifyToken, isAdmin], createGroup);         // Crear un nuevo usuario
groupRouter.get('/',[verifyToken], getAllGroups);         // Obtener todos los usuarios
groupRouter.get('/:id',[verifyToken], getGroupById);      // Obtener un usuario por su ID
groupRouter.put('/:id',[verifyToken, isAdmin], updateGroup);       // Actualizar un usuario por su ID
groupRouter.delete('/:id',[verifyToken, isAdmin], deleteGroup);    // Eliminar un usuario por su ID

export default groupRouter;
