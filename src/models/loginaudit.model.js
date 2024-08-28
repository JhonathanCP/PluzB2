// Importar Sequelize
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const LoginAudit = sequelize.define('LoginAudit', {
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    success: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    publicIp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    privateIp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    system: {
        type: DataTypes.STRING,
        allowNull: false
    }
});