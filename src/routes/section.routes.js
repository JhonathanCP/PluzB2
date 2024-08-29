import { Router } from 'express';
import { createSection, getAllSections, getSectionById, updateSection, deleteSection } from '../controllers/section.controller.js';
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const sectionRouter = Router();

// Rutas para las operaciones CRUD
sectionRouter.post('/',[verifyToken, isAdmin], createSection);         // Crear un nuevo usuario
sectionRouter.get('/',[verifyToken], getAllSections);         // Obtener todos los usuarios
sectionRouter.get('/:id',[verifyToken], getSectionById);      // Obtener un usuario por su ID
sectionRouter.put('/:id',[verifyToken, isAdmin], updateSection);       // Actualizar un usuario por su ID
sectionRouter.delete('/:id',[verifyToken, isAdmin], deleteSection);    // Eliminar un usuario por su ID

export default sectionRouter;
