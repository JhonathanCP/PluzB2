import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('BuyerProfile', 'root', 'root', {
    host: 'localhost',
    dialect: 'postgres',
//    dialectOptions: {
//       ssl: true
//      }
})
