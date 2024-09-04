// Importar Sequelize
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

// Definir el modelo Role
export const SectionType = sequelize.define('section_type', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});