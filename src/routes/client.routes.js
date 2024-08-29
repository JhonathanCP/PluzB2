import { Router } from 'express';
import { createClient, getAllClients, getClientById, updateClient, deleteClient } from '../controllers/client.controller.js';
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const clientRouter = Router();

// Rutas para las operaciones CRUD
clientRouter.post('/',[verifyToken, isAdmin], createClient);         // Crear un nuevo usuario
clientRouter.get('/',[verifyToken], getAllClients);         // Obtener todos los usuarios
clientRouter.get('/:id',[verifyToken], getClientById);      // Obtener un usuario por su ID
clientRouter.put('/:id',[verifyToken, isAdmin], updateClient);       // Actualizar un usuario por su ID
clientRouter.delete('/:id',[verifyToken, isAdmin], deleteClient);    // Eliminar un usuario por su ID

export default clientRouter;
