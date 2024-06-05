import { Router } from "express";
import { createMainDependency, deleteMainDependency, getAllMainDependencies, getMainDependencyById, updateMainDependency} from "../controllers/maindependency.controller.js"
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const mainDependencyRouter = Router()

mainDependencyRouter.get('/', getAllMainDependencies);
mainDependencyRouter.post('/', [verifyToken, isAdmin], createMainDependency);
mainDependencyRouter.put('/:id', [verifyToken, isAdmin],updateMainDependency);
mainDependencyRouter.delete('/:id', [verifyToken, isAdmin],deleteMainDependency);
mainDependencyRouter.get('/:id', getMainDependencyById);

export default mainDependencyRouter;