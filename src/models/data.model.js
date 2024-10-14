import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

// Definir el modelo oldData
export const OldData = sequelize.define('old_data', {
    data: {
        type: DataTypes.BLOB('long'), // Para almacenar archivos grandes como .xlsx
        allowNull: false
    }
});

// Definir el modelo newData
export const NewData = sequelize.define('new_data', {
    data: {
        type: DataTypes.BLOB('long'), // Para almacenar archivos grandes como .xlsx
        allowNull: false
    }
});
