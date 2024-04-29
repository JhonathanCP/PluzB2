import { Router } from "express";
import { uploadPdfMiddleware, getAllAccessRequests, getAccessRequestById, createAccessRequest, updateAccessRequest, deleteAccessRequest, uploadPdfForAccessRequest, getPdfById } from "../controllers/accessrequest.controller.js"
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const accessRequestRouter = Router()

accessRequestRouter.get('/', [verifyToken, isAdmin], getAllAccessRequests);
accessRequestRouter.get('/:id', [verifyToken, isAdmin], getAccessRequestById);
accessRequestRouter.post('/', [verifyToken, isAdmin], createAccessRequest);
accessRequestRouter.put('/:id', [verifyToken, isAdmin],updateAccessRequest);
accessRequestRouter.delete('/:id', [verifyToken, isAdmin],deleteAccessRequest);
accessRequestRouter.post('/:id/pdf', [verifyToken, isAdmin], uploadPdfMiddleware, uploadPdfForAccessRequest);
accessRequestRouter.get('/:id/pdf',  getPdfById);

export default accessRequestRouter;