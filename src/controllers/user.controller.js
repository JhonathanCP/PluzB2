import { User } from '../models/user.model.js';
import { Role } from '../models/role.model.js';
import nodemailer from 'nodemailer';
import passwordGenerator from 'generate-password';
import { EMAIL_USER, EMAIL_PASSWORD } from "../config.js";

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
    service: 'Outlook', // o tu servicio de correo preferido
    auth: {
        user: EMAIL_USER, // tu email
        pass: EMAIL_PASSWORD, // tu contraseña de email
    },
});

// Función para enviar correo
const sendEmail = async (email, username, password) => {
    const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: 'Bienvenido - Tus credenciales de acceso',
        text: `Hola ${username},\n\nTus credenciales son las siguientes:\n\nUsuario: ${email}\nContraseña: ${password}\n\nPor favor, cambia tu contraseña después de iniciar sesión.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado a:', email);
    } catch (error) {
        console.log('Error enviando el correo:', error);
    }
};

// Crear un nuevo usuario con contraseña autogenerada y envío de correo
export const createUser = async (req, res) => {
    try {
        const { username, email, roleId } = req.body;

        const lowercaseUsername = username.toLowerCase();

        // Verifica si el rol existe
        const role = await Role.findByPk(roleId);
        if (!role) {
            return res.status(400).json({ message: "Role not found" });
        }

        // Generar una contraseña segura
        const password = passwordGenerator.generate({
            length: 10,
            numbers: true,
            uppercase: true,
            lowercase: true,
            symbols: false, // opcional si deseas incluir símbolos
        });

        // Crea el usuario con la contraseña generada
        const user = await User.create({ username: lowercaseUsername, email, password, roleId });

        // Envía el correo con las credenciales
        await sendEmail(email, username, password);

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
