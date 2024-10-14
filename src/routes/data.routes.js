import { Router } from 'express';
import { executeLoadDataScript, downloadOldData, uploadNewData, uploadExcelMiddleware } from '../controllers/data.controller.js';
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const dataRouter = Router();

// Ruta para ejecutar el script de carga masiva
dataRouter.post('/', [verifyToken, isAdmin], executeLoadDataScript);

// Ruta para descargar el archivo old_data (Excel)
dataRouter.get('/download-old-data', [verifyToken, isAdmin], downloadOldData);

// Ruta para subir y actualizar el archivo new_data usando memoryStorage
dataRouter.post('/upload-new-data', [verifyToken, isAdmin], uploadExcelMiddleware, uploadNewData);

export default dataRouter;
