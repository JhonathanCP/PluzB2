import { Router } from "express";
import { createRL, getAllRLs, getRLById, updateRL, deleteRL } from "../controllers/rl.controller.js"
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const RLRouter = Router()

RLRouter.get('/', getAllRLs);
RLRouter.post('/', [verifyToken, isAdmin], createRL);
RLRouter.put('/:id', [verifyToken, isAdmin],updateRL);
RLRouter.delete('/:id', [verifyToken, isAdmin],deleteRL);
RLRouter.get('/:id', getRLById);

export default RLRouter;