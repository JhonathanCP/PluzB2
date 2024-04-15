import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import {createRoles, createAdmin, createStates} from "./middlewares/initialSetup.js"

const app = express();
createRoles();
createAdmin();
createStates();

app.use(
    cors()
);


app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));



export default app;
