import { Router } from 'express';
import { createGroupService, getAllGroupServices, getGroupServiceById, updateGroupService, deleteGroupService } from '../controllers/groupservices.controller.js';
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const groupServicesRouter = Router();

// Rutas para las operaciones CRUD
groupServicesRouter.post('/',[verifyToken, isAdmin], createGroupService);         // Crear un nuevo usuario
groupServicesRouter.get('/',[verifyToken], getAllGroupServices);         // Obtener todos los usuarios
groupServicesRouter.get('/:id',[verifyToken], getGroupServiceById);      // Obtener un usuario por su ID
groupServicesRouter.put('/:id',[verifyToken, isAdmin], updateGroupService);       // Actualizar un usuario por su ID
groupServicesRouter.delete('/:id',[verifyToken, isAdmin], deleteGroupService);    // Eliminar un usuario por su ID

export default groupServicesRouter;
