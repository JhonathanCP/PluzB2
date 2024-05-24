import { AccessRequest, State, Notification } from "../models/models.js";
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {limits: 10 * 1024 * 1024}
});

// Obtener todas las solicitudes de acceso
export const getAllAccessRequests = async (req, res) => {
    try {
        const accessRequests = await AccessRequest.findAll();
        res.json(accessRequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las solicitudes de acceso" });
    }
};

// Obtener una solicitud de acceso por su ID
export const getAccessRequestById = async (req, res) => {
    const { id } = req.params;
    try {
        const accessRequest = await AccessRequest.findByPk(id);
        if (accessRequest) {
            res.json(accessRequest);
        } else {
            res.status(404).json({ message: "Solicitud de acceso no encontrada" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener la solicitud de acceso" });
    }
};
// Crear una nueva solicitud de acceso sin el pdfBlob
export const createAccessRequest = async (req, res) => {
    const { justification, cargo, nombreJefe, cargoJefe, UserId, ReportIds } = req.body;

    try {
        // Buscar el estado "PENDIENTE DE FIRMA"
        const state = await State.findOne({
            where: { name: 'PENDIENTE DE FIRMA' }
        });

        // Verificar si se encontró el estado
        if (!state) {
            return res.status(404).json({ message: "Estado 'PENDIENTE DE FIRMA' no encontrado" });
        }

        // Crear la solicitud de acceso con el estado encontrado
        const newAccessRequest = await AccessRequest.create({
            justification,
            cargo,
            nombreJefe,
            cargoJefe,
            UserId,
            StateId: state.id, // Asignar el ID del estado encontrado
        });

        // Asociar los ReportIds a la solicitud de acceso creada
        if (ReportIds && Array.isArray(ReportIds)) {
            await newAccessRequest.addReports(ReportIds);
        }

        res.status(201).json(newAccessRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear la solicitud de acceso" });
    }
};



// Actualizar una solicitud de acceso existente sin el pdfBlob
export const updateAccessRequest = async (req, res) => {
    const { id } = req.params;
    const { justification, cargo, nombreJefe, cargoJefe, UserId, StateId, ReportId } = req.body;
    try {
        const accessRequest = await AccessRequest.findByPk(id);
        if (accessRequest) {
            await accessRequest.update({
                justification,
                cargo,
                nombreJefe,
                cargoJefe,
                UserId,
                StateId,
                ReportId
            });
            res.json(accessRequest);
        } else {
            res.status(404).json({ message: "Solicitud de acceso no encontrada" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar la solicitud de acceso" });
    }
};

// Actualizar una solicitud de acceso existente sin el pdfBlob
export const approveAccessRequest = async (req, res) => {
    const { id } = req.params;
    const { justification, cargo, nombreJefe, cargoJefe, UserId, StateId } = req.body;
    try {
        const accessRequest = await AccessRequest.findByPk(id);
        if (accessRequest) {
            await accessRequest.update({
                justification,
                cargo,
                nombreJefe,
                cargoJefe,
                UserId,
                StateId
            });
            await Notification.create({
                UserId: UserId,
                name: 'Respuesta de solicitud de acceso',
                shortDescription: `Su solicitud de acceso a los reportes ha sido aprobada.`
            });
            res.json(accessRequest);
        } else {
            res.status(404).json({ message: "Solicitud de acceso no encontrada" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar la solicitud de acceso" });
    }
};

// Actualizar una solicitud de acceso existente sin el pdfBlob
export const denyAccessRequest = async (req, res) => {
    const { id } = req.params;
    const { justification, cargo, nombreJefe, cargoJefe, UserId, StateId, ReportId } = req.body;
    try {
        const accessRequest = await AccessRequest.findByPk(id);
        if (accessRequest) {
            await accessRequest.update({
                justification,
                cargo,
                nombreJefe,
                cargoJefe,
                UserId,
                StateId,
                ReportId
            });
            res.json(accessRequest);
        } else {
            res.status(404).json({ message: "Solicitud de acceso no encontrada" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar la solicitud de acceso" });
    }
};

// Subir el archivo PDF para una solicitud de acceso existente
export const uploadPdfForAccessRequest = async (req, res) => {
    const { id } = req.params;
    const pdfBlob = req.file.buffer; // Suponiendo que el archivo PDF se envía en req.file

    try {
        // Verificar si se proporcionó un archivo PDF
        if (!pdfBlob) {
            return res.status(400).json({ message: "No se proporcionó un archivo PDF" });
        }

        // Buscar la solicitud de acceso por su ID
        const accessRequest = await AccessRequest.findByPk(id);
        if (!accessRequest) {
            return res.status(404).json({ message: "Solicitud de acceso no encontrada" });
        }

        // Buscar el estado "POR REVISAR"
        const reviewState = await State.findOne({
            where: { name: 'POR REVISAR' }
        });

        // Verificar si se encontró el estado
        if (!reviewState) {
            return res.status(404).json({ message: "Estado 'POR REVISAR' no encontrado" });
        }

        // Actualizar el estado de la solicitud al estado "POR REVISAR"
        accessRequest.StateId = reviewState.id;
        accessRequest.pdfBlob = pdfBlob

        // Guardar los cambios en la base de datos
        await accessRequest.save();

        res.json({ message: "PDF subido correctamente para la solicitud de acceso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al subir el PDF para la solicitud de acceso" });
    }
};



// Eliminar una solicitud de acceso
export const deleteAccessRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const accessRequest = await AccessRequest.findByPk(id);
        if (accessRequest) {
            await accessRequest.destroy();
            res.json({ message: "Solicitud de acceso eliminada exitosamente" });
        } else {
            res.status(404).json({ message: "Solicitud de acceso no encontrada" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar la solicitud de acceso" });
    }
};

// Obtener el PDF de una solicitud de acceso por su ID
export const getPdfById = async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar la solicitud de acceso por su ID
        const accessRequest = await AccessRequest.findByPk(id);

        // Verificar si se encontró la solicitud de acceso
        if (!accessRequest) {
            return res.status(404).json({ message: "Solicitud de acceso no encontrada" });
        }

        // Verificar si la solicitud de acceso tiene un PDF asociado
        if (!accessRequest.pdfBlob) {
            return res.status(404).json({ message: "PDF no encontrado para esta solicitud de acceso" });
        }

        // Configurar el encabezado Content-Type para indicar que estás enviando un archivo PDF
        res.setHeader('Content-Type', 'application/pdf');

        // Enviar el contenido del PDF como el cuerpo de la respuesta
        res.send(accessRequest.pdfBlob);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el PDF para la solicitud de acceso" });
    }
};


// Aplicar el middleware de multer para manejar la carga de archivos
export const uploadPdfMiddleware = upload.single('pdfBlob');