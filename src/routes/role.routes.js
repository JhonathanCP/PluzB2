import express from 'express';
import { createRole, getAllRoles, getRoleById, updateRole, deleteRole } from '../controllers/role.controller.js';

const roleRouter = express.Router();

roleRouter.post('/', createRole);          // Crear un rol
roleRouter.get('/', getAllRoles);          // Obtener todos los roles
roleRouter.get('/:id', getRoleById);       // Obtener un rol por ID
roleRouter.put('/:id', updateRole);        // Actualizar un rol por ID
roleRouter.delete('/:id', deleteRole);     // Eliminar un rol por ID

export default roleRouter;
