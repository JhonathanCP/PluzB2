import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('pbi_gctic_v1.1_BCK1', 'postgres', 'AKindOfMagic', {
    host: '10.0.1.229',
    dialect: 'postgres',
//    dialectOptions: {
//       ssl: true
//      }
})
