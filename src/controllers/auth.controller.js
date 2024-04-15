import jwt from "jsonwebtoken";
import axios from "axios"; // Agrega esta línea
import { User, Role } from "../models/models.js"
import { SECRET } from "../config.js";

export const signinHandler = async (req, res) => {
    try {
        const { username, password, systemcode } = req.body;

        // Intenta encontrar al usuario localmente
        const userFound = await User.findOne({ where: { username } });

        // Si el usuario se encuentra localmente y utiliza autenticación LDAP, verifica en el servicio externo
        if (userFound && userFound.ldap) {
            try {
                const response = await axios.post("http://10.0.1.230:8089/login", {
                    username,
                    password,
                    systemcode
                });
        
                // Si la autenticación en el servicio externo es exitosa, crea un token válido
                if (response.data.token) {
                    const token = jwt.sign({ id: userFound.id, username: userFound.username, role: userFound.RoleId }, SECRET, {
                        expiresIn: "7200s", // 24 hours
                    });
                    return res.status(200).json({ token });
                } else {
                    // Si la autenticación en el servicio externo falla, devuelve el mensaje de error recibido
                    return res.status(401).json({ message: response.data.message });
                }
            } catch (externalAuthError) {
                console.error(externalAuthError);
                return res.status(401).json({ message: "Autenticación LDAP ha fallado" });
            }
        }
        

        // Si el usuario no se encuentra localmente, crea un nuevo usuario después de la autenticación externa
        if (!userFound) {
            try {
                const response = await axios.post("http://10.0.1.230:8089/login", {
                    username,
                    password,
                    systemcode
                });

                // Si la autenticación en el servicio externo es exitosa, crea un nuevo usuario local
                if (response.data) {
                    // Aquí puedes definir la lógica para generar un email válido a partir del username
                    const email = `${username}@essalud.gob.pe`;
                    const RoleId = 1;

                    // Crea un nuevo usuario en la base de datos local
                    userFound = await User.create({
                        username,
                        email,
                        RoleId
                    });

                    // Crea un token para el nuevo usuario creado
                    const token = jwt.sign({ id: userFound.id, username: userFound.username, role: userFound.RoleId }, SECRET, {
                        expiresIn: "7200s" // 2 hours
                    });

                    return res.status(200).json({ token });
                } else {
                    // Si la autenticación en el servicio externo falla, devuelve un mensaje de error
                    return res.status(401).json({ message: "Credenciales inválidas" });
                }
            } catch (externalAuthError) {
                console.error(externalAuthError);
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
                return res.status(200).json({ token });
            } else {
                return res.status(401).json({ message: "Contraseña incorrecta" });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};