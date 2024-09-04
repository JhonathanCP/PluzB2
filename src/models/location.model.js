// Importar Sequelize
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

// Definir el modelo Role
export const Location = sequelize.define('location', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    responsible: {
        type: DataTypes.STRING,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});