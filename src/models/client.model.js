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
    dob: {
        type:DataTypes.DATEONLY,
        allowNull: false
    },
    politicalParty: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ocupation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    approvalRate: {
        type: DataTypes.STRING,
        allowNull: true
    },
    link: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});