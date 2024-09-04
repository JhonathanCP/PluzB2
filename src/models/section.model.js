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
    kpiname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    kpireferencia: {
        type: DataTypes.STRING,
        allowNull: false
    },
    kpivalue: {
        type: DataTypes.STRING,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});