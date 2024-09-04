import { Router } from 'express';
import { createLocation, getAllLocations, getLocationById, updateLocation, deleteLocation } from '../controllers/location.controller.js';
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const locationRouter = Router();

// Rutas para las operaciones CRUD
locationRouter.post('/', [verifyToken, isAdmin], createLocation);          // Crear una nueva ubicación
locationRouter.get('/', [verifyToken], getAllLocations);                   // Obtener todas las ubicaciones
locationRouter.get('/:id', [verifyToken], getLocationById);                // Obtener una ubicación por su ID
locationRouter.put('/:id', [verifyToken, isAdmin], updateLocation);        // Actualizar una ubicación por su ID
locationRouter.delete('/:id', [verifyToken, isAdmin], deleteLocation);     // Eliminar una ubicación por su ID

export default locationRouter;
