import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { OldData, NewData } from '../models/data.model.js';
import { promisify } from 'util';
import multer from 'multer';

// Configuración de multer para almacenar en memoria
const storage = multer.memoryStorage(); // Usamos almacenamiento en memoria
const upload = multer({ storage: storage });

// Middleware para subir el archivo Excel
export const uploadExcelMiddleware = upload.single('file');

// Definir __dirname en un entorno ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para ejecutar el script de carga masiva
export const executeLoadDataScript = (req, res) => {
    const scriptPath = path.join(__dirname, '../database/carga_masiva.py');
    const pythonExecutable = 'python3';

    const escapedScriptPath = `"${scriptPath}"`;

    exec(`${pythonExecutable} ${escapedScriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error ejecutando el script: ${stderr}`);
            return res.status(500).json({ message: 'Error ejecutando el script', error: stderr });
        }
        console.log(`Resultado del script: ${stdout}`);
        return res.status(200).json({ message: 'Script ejecutado exitosamente', output: stdout });
    });
};

// Método para descargar el archivo old_data
export const downloadOldData = async (req, res) => {
    try {
        const oldDataRecord = await OldData.findOne();
        if (!oldDataRecord || !oldDataRecord.data) {
            return res.status(404).json({ message: 'No hay datos antiguos disponibles.' });
        }

        // Enviar el archivo como respuesta
        const oldDataBuffer = oldDataRecord.data; // Asegúrate de que 'data' es un campo BLOB o binario

        res.setHeader('Content-Disposition', 'attachment; filename="old_data.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        
        // Enviar el archivo como un buffer para mantener la integridad del archivo
        res.status(200).send(Buffer.from(oldDataBuffer));  // No necesitamos 'binary', ya que se guarda como binario
    } catch (error) {
        console.error('Error al descargar el archivo old_data:', error);
        res.status(500).json({ message: 'Error al descargar el archivo old_data.' });
    }
};

// Método para subir un nuevo archivo Excel a new_data
export const uploadNewData = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ningún archivo. Verifique el campo y vuelva a intentar.' });
        }

        const newFileData = req.file.buffer; // Obtener los datos del archivo directamente desde la memoria

        // Obtener el registro actual de new_data
        let newDataRecord = await NewData.findOne();

        if (newDataRecord) {
            // Si existe un registro en new_data, copiarlo a old_data antes de reemplazarlo
            let oldDataRecord = await OldData.findOne();

            if (oldDataRecord) {
                console.log("Actualizando old_data con el contenido de new_data.");
                await oldDataRecord.update({ data: newDataRecord.data });
            } else {
                console.log("Creando un nuevo registro en old_data con el contenido de new_data.");
                await OldData.create({ data: newDataRecord.data });
            }

            // Reemplazar el registro en new_data
            console.log("Actualizando new_data con el nuevo archivo subido.");
            await newDataRecord.update({ data: newFileData });
        } else {
            // Si no hay registro en new_data, crear uno nuevo
            console.log("Creando un nuevo registro en new_data con el archivo subido.");
            newDataRecord = await NewData.create({ data: newFileData });
        }

        res.status(200).json({ message: 'Archivo subido y procesado correctamente.' });
    } catch (error) {
        console.error('Error al subir el archivo new_data:', error.message);
        res.status(500).json({ message: 'Error al subir el archivo new_data.' });
    }
};
