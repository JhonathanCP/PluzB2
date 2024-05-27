import app from "./app.js";
import { sequelize } from "./database/database.js"
import './models/models.js'

async function main() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({alter: true});
        console.log('Database connected');
        app.listen(4000);
        console.log("Server is listening on port", 4000);
    } catch (error) {
        console.log('Unable to connect to database', error);
    }
}

main();