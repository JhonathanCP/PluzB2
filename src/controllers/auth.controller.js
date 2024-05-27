import jwt from "jsonwebtoken";
import axios from "axios";
import { User, Role, LoginAudit } from "../models/models.js";
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
        const { username, password, systemcode } = req.body;
        const lowercaseUsername = username.toLowerCase();

        const { publicIp, privateIp } = getIpAddresses(req);
        const system = req.headers['user-agent'] || 'unknown';

        // Intenta encontrar al usuario localmente
        let userFound = await User.findOne({ where: { username: lowercaseUsername } });

        // Si el usuario se encuentra localmente y utiliza autenticación LDAP, verifica en el servicio externo
        if (userFound && userFound.ldap) {
            try {
                const response = await axios.post("http://10.0.1.230:8089/login", {
                    username: lowercaseUsername,
                    password,
                    systemcode
                });
        
                // Si la autenticación en el servicio externo es exitosa, crea un token válido
                if (response.data.token) {
                    const token = jwt.sign({ id: userFound.id, username: userFound.username, role: userFound.RoleId }, SECRET, {
                        expiresIn: "7200s" // 2 hours
                    });

                    // Registrar intento de login exitoso
                    await LoginAudit.create({
                        success: true,
                        publicIp,
                        privateIp,
                        system,
                        UserId: userFound.id
                    });

                    return res.status(200).json({ token });
                } else {
                    // Registrar intento de login fallido
                    await LoginAudit.create({
                        success: false,
                        publicIp,
                        privateIp,
                        system,
                        UserId: userFound.id
                    });

                    // Si la autenticación en el servicio externo falla, devuelve el mensaje de error recibido
                    return res.status(401).json({ message: response.data.message });
                }
            } catch (externalAuthError) {
                console.error(externalAuthError);

                // Registrar intento de login fallido
                await LoginAudit.create({
                    success: false,
                    publicIp,
                    privateIp,
                    system,
                    UserId: userFound.id
                });

                return res.status(401).json({ message: "Autenticación LDAP ha fallado" });
            }
        }

        // Si el usuario no se encuentra localmente, crea un nuevo usuario después de la autenticación externa
        if (!userFound) {
            try {
                const response = await axios.post("http://10.0.1.230:8089/login", {
                    username: lowercaseUsername,
                    password,
                    systemcode
                });

                // Si la autenticación en el servicio externo es exitosa, crea un nuevo usuario local
                if (response.data.token) {
                    // Aquí puedes definir la lógica para generar un email válido a partir del username
                    const email = `${lowercaseUsername}@essalud.gob.pe`;
                    const RoleId = 1;

                    // Crea un nuevo usuario en la base de datos local
                    userFound = await User.create({
                        username: lowercaseUsername,
                        email,
                        RoleId
                    });

                    // Crea un token para el nuevo usuario creado
                    const token = jwt.sign({ id: userFound.id, username: userFound.username, role: userFound.RoleId }, SECRET, {
                        expiresIn: "7200s" // 2 hours
                    });

                    // Registrar intento de login exitoso
                    await LoginAudit.create({
                        success: true,
                        publicIp,
                        privateIp,
                        system,
                        UserId: userFound.id
                    });

                    return res.status(200).json({ token });
                } else {
                    // Registrar intento de login fallido
                    await LoginAudit.create({
                        success: false,
                        publicIp,
                        privateIp,
                        system,
                        UserId: null
                    });

                    // Si la autenticación en el servicio externo falla, devuelve un mensaje de error
                    return res.status(401).json({ message: "Credenciales inválidas" });
                }
            } catch (externalAuthError) {
                console.error(externalAuthError);

                // Registrar intento de login fallido
                await LoginAudit.create({
                    success: false,
                    publicIp,
                    privateIp,
                    system,
                    UserId: null
                });

                return res.status(401).json({ message: "Autenticación LDAP ha fallado" });
            }
        }

        // Si el usuario se encuentra localmente y no utiliza autenticación LDAP, verifica la contraseña localmente
        if (userFound && !userFound.ldap) {
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
                    UserId: userFound.id
                });

                return res.status(200).json({ token });
            } else {
                // Registrar intento de login fallido
                await LoginAudit.create({
                    success: false,
                    publicIp,
                    privateIp,
                    system,
                    UserId: userFound.id
                });

                return res.status(401).json({ message: "Contraseña incorrecta" });
            }
        }
    } catch (error) {
        console.error(error);

        // Registrar intento de login fallido
        await LoginAudit.create({
            success: false,
            publicIp,
            privateIp,
            system,
            UserId: null
        });

        return res.status(500).json({ message: "Internal Server Error" });
    }
};
