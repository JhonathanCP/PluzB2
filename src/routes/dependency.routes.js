import { Router } from "express";
import { createDependency, deleteDependency, getAllDependencies, getDependencyById, updateDependency} from "../controllers/dependency.controller.js"
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const dependencyRouter = Router()

dependencyRouter.get('/', getAllDependencies);
dependencyRouter.post('/', [verifyToken, isAdmin], createDependency);
dependencyRouter.put('/:id', [verifyToken, isAdmin],updateDependency);
dependencyRouter.delete('/:id', [verifyToken, isAdmin],deleteDependency);
dependencyRouter.get('/:id', getDependencyById);

export default dependencyRouter;