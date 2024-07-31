import { AccessRequest, State, Notification, Report, Group, Module, User } from "../models/models.js";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { limits: 10 * 1024 * 1024 }
});

// Obtener todas las solicitudes de acceso
export const getAllAccessRequests = async (req, res) => {
    try {
        const accessRequests = await AccessRequest.findAll({
            attributes: { exclude: ['pdfBlob'] }, // Excluir el campo pdfBlob
            include: [
                { model: Report, attributes: { exclude: ['pdfBlob'] }, through: { attributes: [] } }, // Excluir el campo pdfBlob en Report
                { model: User, as: 'RequestedFor', attributes: { exclude: ['pdfBlob'] }, through: { attributes: [] } } // Excluir el campo pdfBlob en User
            ]
        });
        res.json(accessRequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las solicitudes de acceso" });
    }
};

export const getAccessRequestsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const accessRequests = await AccessRequest.findAll({
            where: { UserId: userId },
            attributes: { exclude: ['pdfBlob'] }, // Excluir el campo pdfBlob
            include: [
                { model: Report, attributes: { exclude: ['pdfBlob'] }, through: { attributes: [] } }, // Excluir el campo pdfBlob en Report
                { model: User, as: 'RequestedFor', attributes: { exclude: ['pdfBlob'] }, through: { attributes: [] } } // Excluir el campo pdfBlob en User
            ]
        });
        res.json(accessRequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las solicitudes de acceso para el usuario" });
    }
};


// Obtener una solicitud de acceso por su ID
export const getAccessRequestById = async (req, res) => {
    const { id } = req.params;
    try {
        const accessRequest = await AccessRequest.findByPk(id, {
            include: [
                { model: Report, through: { attributes: [] } }, // Incluir los reportes asociados
                { model: User, as: 'RequestedFor', through: { attributes: [] } } // Incluir los usuarios solicitados
            ]
        });
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


export const createAccessRequest = async (req, res) => {
    const { nombreSolicitante, UserId, requestedUserIds, ReportIds } = req.body;

    try {
        // Buscar el estado "PENDIENTE DE FIRMA"
        const state = await State.findOne({
            where: { name: 'PENDIENTE DE FIRMA' }
        });

        // Verificar si se encontró el estado
        if (!state) {
            return res.status(404).json({ message: "Estado 'PENDIENTE DE FIRMA' no encontrado" });
        }

        // Crear la solicitud de acceso sin el PDF
        const newAccessRequest = await AccessRequest.create({
            nombreSolicitante,
            UserId, // ID del solicitante
            StateId: state.id, // Asignar el ID del estado encontrado
        });

        // Asociar los ReportIds a la solicitud de acceso creada
        let reportNames = [];
        if (ReportIds && Array.isArray(ReportIds)) {
            const reports = await Report.findAll({
                where: {
                    id: ReportIds
                }
            });
            await newAccessRequest.addReports(reports);
            reportNames = reports.map(report => report.name);
        }

        // Asociar los requestedUserIds a la solicitud de acceso creada
        let requestedUserNames = [];
        if (requestedUserIds && Array.isArray(requestedUserIds)) {
            const users = await User.findAll({
                where: {
                    id: requestedUserIds
                }
            });
            await newAccessRequest.addRequestedFor(users);
            requestedUserNames = users.map(user => user.username);
        }

        // Crear notificación para el solicitante
        await Notification.create({
            UserId: UserId, // Usuario solicitante
            name: 'Envío de solicitud de acceso',
            shortDescription: 'Su solicitud de acceso ha sido creada, por favor firmarlo digitalmente.',
            link: '/user-requests'
        });

        // Crear un nuevo documento PDF con pdfkit
        const doc = new PDFDocument({ layout: 'landscape' });
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            const pdfBuffer = Buffer.concat(buffers);

            // Guardar el PDF en el campo pdfBlob
            newAccessRequest.pdfBlob = pdfBuffer;
            await newAccessRequest.save();

            res.status(201).json(newAccessRequest);
        });

        // Ruta absoluta al logo
        const logoPath = path.join(__dirname, '../assets/logo.png');

        // Agregar logo al PDF
        doc.image(logoPath, doc.page.width - 160, 20, { width: 140 });

        // Agregar contenido al PDF en forma de cuadros
        doc.fontSize(11);

        // Dibujar cuadro para Nombre del solicitante y Fecha de Solicitud
        const halfWidth = (doc.page.width - 100) / 2;
        const headerHeight = 30;
        const contentHeight = 30;

        // Títulos
        doc.rect(50, 100, halfWidth, headerHeight).stroke();
        doc.rect(50 + halfWidth, 100, halfWidth, headerHeight).stroke();
        doc.fillColor('black').text('Nombre del solicitante', 60, 110);
        doc.text(nombreSolicitante, 60 + halfWidth, 110);

        // Contenidos
        doc.rect(50, 130, halfWidth, contentHeight).stroke();
        doc.rect(50 + halfWidth, 130, halfWidth, contentHeight).stroke();
        doc.text('Fecha de Solicitud', 60, 140);
        doc.text(newAccessRequest.createdAt.toLocaleString(), 60 + halfWidth, 140);

        // Dibujar cuadro para Reportes Solicitados y Usuarios a los que se les solicita el acceso
        const sectionHeight = doc.page.height - 330 - headerHeight;

        // Títulos
        doc.rect(50, 170, halfWidth, headerHeight).stroke();
        doc.rect(50 + halfWidth, 170, halfWidth, headerHeight).stroke();
        doc.fillColor('black').text('Reportes Solicitados', 60, 180);
        doc.text('Usuarios a los que se les solicita el acceso', 60 + halfWidth, 180);

        // Contenidos
        doc.rect(50, 200, halfWidth, sectionHeight).stroke();
        doc.rect(50 + halfWidth, 200, halfWidth, sectionHeight).stroke();

        reportNames.forEach((reportName, index) => {
            doc.text(`${index + 1}. ${reportName}`, 60, 210 + index * 20);
        });

        requestedUserNames.forEach((userName, index) => {
            doc.text(`${index + 1}. ${userName}@essalud.gob.pe`, 60 + halfWidth, 210 + index * 20);
        });

        // Dibujar cuadro para firmas digitales
        doc.rect(50, doc.page.height - 145, doc.page.width - 100, 115).stroke();
        doc.fontSize(9).text('Firmar digitalmente en esta sección', 50, doc.page.height - 140, { width: doc.page.width - 100, align: 'center' });

        // Finalizar el documento PDF
        doc.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear la solicitud de acceso" });
    }
};
// Actualizar una solicitud de acceso existente sin el pdfBlob
export const updateAccessRequest = async (req, res) => {
    const { id } = req.params;
    const { nombreSolicitante, UserId, StateId, requestedUserIds, ReportIds } = req.body;

    try {
        const accessRequest = await AccessRequest.findByPk(id);

        if (accessRequest) {
            // Actualizar los campos de la solicitud de acceso
            await accessRequest.update({
                nombreSolicitante,
                UserId,
                StateId
            });

            // Actualizar las asociaciones de reportes
            if (ReportIds && Array.isArray(ReportIds)) {
                const reports = await Report.findAll({
                    where: {
                        id: ReportIds
                    }
                });
                await accessRequest.setReports(reports);
            }

            // Actualizar las asociaciones de usuarios solicitados
            if (requestedUserIds && Array.isArray(requestedUserIds)) {
                const users = await User.findAll({
                    where: {
                        id: requestedUserIds
                    }
                });
                await accessRequest.setRequestedFor(users);
            }

            res.json(accessRequest);
        } else {
            res.status(404).json({ message: "Solicitud de acceso no encontrada" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar la solicitud de acceso" });
    }
};

// Aprobar una solicitud de acceso existente y actualizar el estado a "APROBADO"
export const approveAccessRequest = async (req, res) => {
    const { id } = req.params;

    try {
        const accessRequest = await AccessRequest.findByPk(id, {
            include: [
                { model: Report, through: { attributes: [] } }, // Incluir los reportes asociados
                { model: User, as: 'RequestedFor', through: { attributes: [] } } // Incluir los usuarios solicitados
            ]
        });
        if (!accessRequest) {
            return res.status(404).json({ message: "Solicitud de acceso no encontrada" });
        }

        // Buscar el estado "APROBADO"
        const state = await State.findOne({
            where: { name: 'APROBADO' }
        });

        if (!state) {
            return res.status(404).json({ message: "Estado 'APROBADO' no encontrado" });
        }

        // Actualizar la solicitud de acceso
        await accessRequest.update({
            StateId: state.id
        });

        // Crear notificación para el solicitante
        await Notification.create({
            UserId: accessRequest.UserId, // Usuario solicitante
            name: 'Respuesta de solicitud de acceso',
            shortDescription: 'Su solicitud de acceso a los reportes ha sido aprobada.',
            link: '/user-requests'
        });

        // Obtener los IDs de los usuarios y reportes asociados
        const requestedUserIds = accessRequest.RequestedFor.map(user => user.id);
        const reportIds = accessRequest.Reports.map(report => report.id);

        // Asociar reportes a los usuarios solicitados
        await associateReportsWithUsers(requestedUserIds, reportIds);

        // Volver a cargar las asociaciones después de la actualización
        await accessRequest.reload({
            include: [
                { model: Report, through: { attributes: [] } },
                { model: User, as: 'RequestedFor', through: { attributes: [] } }
            ]
        });

        res.json(accessRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar la solicitud de acceso" });
    }
};

// Crear una relación usuario-reporte
const associateReportsWithUsers = async (userIds, reportIds) => {
    try {
        if (!Array.isArray(userIds) || !Array.isArray(reportIds)) {
            throw new TypeError('userIds y reportIds deben ser arrays');
        }

        for (const userId of userIds) {
            const user = await User.findByPk(userId);
            if (!user) {
                console.warn(`Usuario con ID ${userId} no encontrado`);
                continue;
            }

            for (const reportId of reportIds) {
                const report = await Report.findByPk(reportId, { include: [Module] });
                if (!report) {
                    console.warn(`Reporte con ID ${reportId} no encontrado`);
                    continue;
                }

                const existingRelation = await user.hasReport(report);
                if (!existingRelation) {
                    await user.addReport(report);
                    await user.addModule(report.Module);
                }
            }
        }
    } catch (error) {
        console.error('Error al asociar reportes con usuarios:', error);
        throw new Error('Error al asociar reportes con usuarios');
    }
};


// Actualizar una solicitud de acceso existente sin el pdfBlob
export const denyAccessRequest = async (req, res) => {
    const { id } = req.params;

    try {
        const accessRequest = await AccessRequest.findByPk(id);
        if (!accessRequest) {
            return res.status(404).json({ message: "Solicitud de acceso no encontrada" });
        }

        // Buscar el estado "APROBADO"
        const state = await State.findOne({
            where: { name: 'DENEGADO' }
        });

        if (!state) {
            return res.status(404).json({ message: "Estado 'DENEGADO' no encontrado" });
        }

        // Actualizar la solicitud de acceso
        await accessRequest.update({
            StateId: state.id
        });

        // Crear notificación para el solicitante
        await Notification.create({
            UserId: accessRequest.UserId, // Usuario solicitante
            name: 'Respuesta de solicitud de acceso',
            shortDescription: 'Su solicitud de acceso a los reportes ha sido denegada.',
            link: '/user-requests'
        });

        res.json(accessRequest);
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

        await Notification.create({
            UserId: accessRequest.UserId, // Usuario solicitante
            name: 'Envío de solicitud de acceso',
            shortDescription: 'Su solicitud de acceso ha sido actualizada con su firma, pronto tendrá una respuesta.',
            link: '/user-requests'
        });

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