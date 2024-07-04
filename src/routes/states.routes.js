import { Router } from "express";
import { getAllStates } from "../controllers/state.controller.js"
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const StatesRouter = Router()

StatesRouter.get('/', getAllStates);

export default StatesRouter;