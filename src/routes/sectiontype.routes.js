import { Router } from 'express';
import { createSectionType, getAllSectionTypes, getSectionTypeById, updateSectionType, deleteSectionType } from '../controllers/sectiontype.controller.js';
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const sectionTypeRouter = Router();

// Rutas para las operaciones CRUD
sectionTypeRouter.post('/', [verifyToken, isAdmin], createSectionType);         // Crear un nuevo tipo de sección
sectionTypeRouter.get('/', [verifyToken], getAllSectionTypes);                  // Obtener todos los tipos de sección
sectionTypeRouter.get('/:id', [verifyToken], getSectionTypeById);               // Obtener un tipo de sección por su ID
sectionTypeRouter.put('/:id', [verifyToken, isAdmin], updateSectionType);       // Actualizar un tipo de sección por su ID
sectionTypeRouter.delete('/:id', [verifyToken, isAdmin], deleteSectionType);    // Eliminar un tipo de sección por su ID

export default sectionTypeRouter;
