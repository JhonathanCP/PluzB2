// Importar Sequelize
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

// Definir el modelo Role
export const Client = sequelize.define('client', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    responsible: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // description: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});