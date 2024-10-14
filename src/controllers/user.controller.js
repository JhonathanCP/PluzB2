import { User } from '../models/user.model.js';
import { Role } from '../models/role.model.js';
import nodemailer from 'nodemailer';
import passwordGenerator from 'generate-password';
import { EMAIL_USER, EMAIL_PASSWORD } from '../config.js';

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false, // true para 465, falso para otros puertos
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
    },
    tls: {
        ciphers: 'SSLv3',
    },
});

// Función para enviar correo
const sendEmailOnCreate = async (email, username, password) => {
    const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: 'Credenciales de acceso - Buyer Profile',
        text: `
            Hola ${username},
            
            Tus credenciales para acceder al sistema son:

            Usuario: ${username}
            Contraseña: ${password}

            Por favor, cambia tu contraseña después de iniciar sesión.

            Atentamente,
            El equipo de Buyer Profile - Pluz
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a: ${email}`);
    } catch (error) {
        console.error(`Error enviando el correo a ${email}:`, error.message);
        throw new Error('No se pudo enviar el correo.');
    }
};

// Función para enviar correo
const sendEmailOnUpdate = async (email, username, password) => {
    const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: 'Credenciales de acceso - Buyer Profile',
        text: `
            Hola ${username},
            
            Tus credenciales se han actualizado:

            Usuario: ${username}
            Contraseña: ${password}

            Atentamente,
            El equipo de Buyer Profile - Pluz
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a: ${email}`);
    } catch (error) {
        console.error(`Error enviando el correo a ${email}:`, error.message);
        throw new Error('No se pudo enviar el correo.');
    }
};

// Función para crear un nuevo usuario con contraseña autogenerada y enviarle el correo
export const createUser = async (req, res) => {
    try {
        const { username, email, roleId } = req.body;

        // Verificar si el rol existe
        const role = await Role.findByPk(roleId);
        if (!role) {
            return res.status(400).json({ message: 'Role not found' });
        }

        // Generar una contraseña aleatoria
        const password = passwordGenerator.generate({
            length: 10,
            numbers: true,
            uppercase: true,
            lowercase: true,
            symbols: false, // Puedes agregar símbolos si lo prefieres
        });

        // Crear el usuario con la contraseña generada
        const user = await User.create({ username, email, password, roleId });

        // Enviar el correo con las credenciales
        await sendEmailOnCreate(email, username, password);

        res.status(201).json({ message: 'Usuario creado y correo enviado correctamente', user });
    } catch (error) {
        console.error('Error creando usuario:', error.message);
        res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
    }
};


// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un usuario por su ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un usuario por su ID
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, roleId } = req.body;

        // Verifica si el usuario existe
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verifica si el rol existe
        if (roleId) {
            const role = await Role.findByPk(roleId);
            if (!role) {
                return res.status(400).json({ message: "Role not found" });
            }
        }

        // Verificar si el email o username ya existen en otro usuario
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        if (username && username.toLowerCase() !== user.username) {
            const existingUsername = await User.findOne({ where: { username: username.toLowerCase() } });
            if (existingUsername) {
                return res.status(400).json({ message: "Username already in use" });
            }
        }

        // Si la contraseña cambia, enviar correo con la nueva contraseña
        if (password) {
            await sendEmailOnUpdate(user.email, user.username, password);
        }

        // Actualiza el usuario
        await user.update({ username, email, password, roleId });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un usuario por su ID
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica si el usuario existe
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Elimina el usuario
        await user.destroy();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Función para recuperar la contraseña
export const recoverPassword = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar al usuario por su email
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Generar una nueva contraseña aleatoria
        const newPassword = passwordGenerator.generate({
            length: 10,
            numbers: true,
            uppercase: true,
            lowercase: true,
            symbols: false, // Puedes agregar símbolos si lo prefieres
        });

        // Actualizar la contraseña del usuario
        user.password = newPassword;
        await user.save();

        // Enviar el correo con la nueva contraseña
        await sendEmailOnUpdate(user.email, user.username, newPassword);

        res.status(200).json({ message: 'Contraseña actualizada correctamente y enviada al correo.' });
    } catch (error) {
        console.error('Error recuperando la contraseña:', error.message);
        res.status(500).json({ message: 'Error al recuperar la contraseña', error: error.message });
    }
};