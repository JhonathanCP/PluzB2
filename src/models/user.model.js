// Importar Sequelize
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import bcrypt from "bcryptjs";

// Definir el modelo User
export const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

// Sequelize hooks for password encryption
User.beforeCreate(async (user) => {
    if (user.changed('password') && user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

User.beforeUpdate(async (user) => {
    if (user.changed('password') && user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

// Sequelize method to compare passwords
User.prototype.comparePassword = async function (password) {
    this.ldap = false; // El usuario se autentica por contraseña
    return await bcrypt.compare(password, this.password);
};