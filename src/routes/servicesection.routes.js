import { Router } from 'express';
import { createServiceSection, getServiceSectionById, getServiceSections, updateServiceSection, deleteServiceSection } from '../controllers/servicesection.controller.js';
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const serviceSectionRouter = Router();

// Rutas para las operaciones CRUD
serviceSectionRouter.post('/',[verifyToken, isAdmin], createServiceSection);         // Crear un nuevo usuario
serviceSectionRouter.get('/',[verifyToken], getServiceSections);         // Obtener todos los usuarios
serviceSectionRouter.get('/:id',[verifyToken], getServiceSectionById);      // Obtener un usuario por su ID
serviceSectionRouter.put('/:id',[verifyToken, isAdmin], updateServiceSection);       // Actualizar un usuario por su ID
serviceSectionRouter.delete('/:id',[verifyToken, isAdmin], deleteServiceSection);    // Eliminar un usuario por su ID

export default serviceSectionRouter;
