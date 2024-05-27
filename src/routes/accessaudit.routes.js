import { Router } from "express";
import { accessReportHandler } from "../controllers/accessaudit.controller.js"

const accessAuditRouter = Router()

accessAuditRouter.post('/', accessReportHandler);

export default accessAuditRouter;