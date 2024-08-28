import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('pluz', 'postgres', 'zxcvqwer159A-', {
    host: '10.0.28.15',
    dialect: 'postgres',
//    dialectOptions: {
//       ssl: true
//      }
})
