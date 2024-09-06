// Importar Sequelize
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

// Definir el modelo Role
export const Section = sequelize.define('section', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    percepcion: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});