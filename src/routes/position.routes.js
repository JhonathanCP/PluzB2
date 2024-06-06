import { Router } from "express";
import { createPosition, deletePosition, getAllPositions, getPositionById, updatePosition } from "../controllers/position.controller.js"
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const PositionRouter = Router()

PositionRouter.get('/', getAllPositions);
PositionRouter.post('/', [verifyToken, isAdmin], createPosition);
PositionRouter.put('/:id', [verifyToken, isAdmin],updatePosition);
PositionRouter.delete('/:id', [verifyToken, isAdmin],deletePosition);
PositionRouter.get('/:id', getPositionById);

export default PositionRouter;