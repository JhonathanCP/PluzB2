import { Router } from "express";
import { getAllModules, getModuleById, createModule, updateModule, deleteModule} from "../controllers/module.controller.js"
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const modulesRouter = Router()

modulesRouter.get('/', getAllModules);
modulesRouter.post('/', [verifyToken, isAdmin], createModule);
modulesRouter.put('/:id', [verifyToken, isAdmin],updateModule);
modulesRouter.delete('/:id', [verifyToken, isAdmin],deleteModule);
modulesRouter.get('/:id', getModuleById);

export default modulesRouter;