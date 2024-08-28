// Importar Sequelize
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

// Definir el modelo Role
export const Role = sequelize.define('Role', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});