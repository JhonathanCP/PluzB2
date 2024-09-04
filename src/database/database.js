import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('pluz', 'postgres', 'zxcvqwer159A-', {
    host: 'localhost',
    dialect: 'postgres',
//    dialectOptions: {
//       ssl: true
//      }
})
