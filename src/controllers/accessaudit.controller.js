import { User, Report, AccessAudit } from "../models/models.js";
import os from 'os';
import requestIp from 'request-ip';

// Función para capturar las IPs
const getIpAddresses = (req) => {
    const publicIp = requestIp.getClientIp(req); // obtener la IP pública

    // Obtener la IP privada
    const networkInterfaces = os.networkInterfaces();
    let privateIp;
    for (const key in networkInterfaces) {
        for (const address of networkInterfaces[key]) {
            if (address.family === 'IPv4' && !address.internal) {
                privateIp = address.address;
                break;
            }
        }
        if (privateIp) break;
    }

    return { publicIp, privateIp };
};

// Controlador para manejar el acceso al reporte
export const accessReportHandler = async (req, res) => {
    try {
        const { userId, reportId } = req.body;
        const { publicIp, privateIp } = getIpAddresses(req);
        const system = req.headers['user-agent'] || 'unknown';

        // Verificar si el usuario y el reporte existen
        const user = await User.findByPk(userId);
        const report = await Report.findByPk(reportId);

        if (!user || !report) {
            return res.status(404).json({ message: "Usuario o Reporte no encontrado" });
        }

        // Registrar intento de acceso
        await AccessAudit.create({
            success: true,
            publicIp,
            privateIp,
            system,
            UserId: user.id,
            ReportId: report.id
        });

        // Aquí puedes devolver el acceso al reporte o la información necesaria
        return res.status(200).json({ message: "Acceso al reporte registrado exitosamente" });
    } catch (error) {
        console.error(error);

        // Registrar intento de acceso fallido
        await AccessAudit.create({
            success: false,
            publicIp,
            privateIp,
            system,
            UserId: req.body.userId,
            ReportId: req.body.reportId
        });

        return res.status(500).json({ message: "Internal Server Error" });
    }
};
