import { Router } from "express";
import { getAllReports, getReportById, getReportsByFreeReport, createReport, updateReport, deleteReport} from "../controllers/report.controller.js"
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const reportsRouter = Router()

reportsRouter.get('/', isAdmin, getAllReports);
reportsRouter.get('/get-free', getReportsByFreeReport);
reportsRouter.post('/', [verifyToken, isAdmin], createReport);
reportsRouter.put('/:id', [verifyToken, isAdmin],updateReport);
reportsRouter.delete('/:id', [verifyToken, isAdmin],deleteReport);
reportsRouter.get('/:id', getReportById);

export default reportsRouter;