import { Router } from "express";
import { getAllGroups, getGroupById, getGroupsByFreeReport, createGroup, updateGroup, deleteGroup} from "../controllers/group.controller.js"
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const groupsRouter = Router()

groupsRouter.get('/', getAllGroups);
groupsRouter.get('/get-free', getGroupsByFreeReport);
groupsRouter.post('/', [verifyToken, isAdmin], createGroup);
groupsRouter.put('/:id', [verifyToken, isAdmin],updateGroup);
groupsRouter.delete('/:id', [verifyToken, isAdmin],deleteGroup);
groupsRouter.get('/:id', getGroupById);

export default groupsRouter;