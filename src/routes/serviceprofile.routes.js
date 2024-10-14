import { Router } from 'express';
import { createServiceProfile, getAllServiceProfiles, getServiceProfileById, updateServiceProfile, deleteServiceProfile } from '../controllers/serviceprofile.controller.js';
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const serviceProfileRouter = Router();

// Rutas para las operaciones CRUD
serviceProfileRouter.post('/',[verifyToken, isAdmin], createServiceProfile);         // Crear un nuevo usuario
serviceProfileRouter.get('/',[verifyToken], getAllServiceProfiles);         // Obtener todos los usuarios
serviceProfileRouter.get('/:id',[verifyToken], getServiceProfileById);      // Obtener un usuario por su ID
serviceProfileRouter.put('/:id',[verifyToken, isAdmin], updateServiceProfile);       // Actualizar un usuario por su ID
serviceProfileRouter.delete('/:id',[verifyToken, isAdmin], deleteServiceProfile);    // Eliminar un usuario por su ID

export default serviceProfileRouter;
