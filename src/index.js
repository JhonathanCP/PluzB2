import app from "./app.js";
import { sequelize } from "./database/database.js"
import './models/associations.js'

async function main() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({alter: true});
        console.log('Database connected');
        app.listen(4500);
        console.log("Server is listening on port", 4500);
    } catch (error) {
        console.log('Unable to connect to database', error);
    }
}

main();