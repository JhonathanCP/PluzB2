// Importar Sequelize
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

// Definir el modelo Role
export const ServiceProfile = sequelize.define('service_profile', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});