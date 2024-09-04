import jwt from "jsonwebtoken";
import axios from "axios";
import { User } from "../models/user.model.js";
import { LoginAudit } from "../models/loginaudit.model.js";
import { SECRET } from "../config.js";
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

export const signinHandler = async (req, res) => {
    try {
        const { username, password } = req.body;
        const lowercaseUsername = username.toLowerCase();

        const { publicIp, privateIp } = getIpAddresses(req);
        const system = req.headers['user-agent'] || 'unknown';

        // Intenta encontrar al usuario localmente
        let userFound = await User.findOne({ where: { username: lowercaseUsername } });

        // Si el usuario se encuentra localmente y no utiliza autenticación LDAP, verifica la contraseña localmente
        if (userFound) {
            const matchPassword = await userFound.comparePassword(password);
            if (matchPassword) {
                const token = jwt.sign({ id: userFound.id, username: userFound.username, role: userFound.RoleId }, SECRET, {
                    expiresIn: "7200s" // 2 hours
                });

                // Registrar intento de login exitoso
                await LoginAudit.create({
                    success: true,
                    publicIp,
                    privateIp,
                    system,
                    userId: userFound.id
                });

                return res.status(200).json({ token });
            } else {
                // Registrar intento de login fallido
                await LoginAudit.create({
                    success: false,
                    publicIp,
                    privateIp,
                    system,
                    userId: userFound.id
                });

                return res.status(401).json({ message: "Contraseña incorrecta" });
            }
        } else {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error(error);

        // Registrar intento de login fallido
        await LoginAudit.create({
            success: false,
            publicIp,
            privateIp,
            system,
            userId: null
        });

        return res.status(500).json({ message: "Internal Server Error" });
    }
};