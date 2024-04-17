import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import {createRoles, createAdmin, createStates} from "./middlewares/initialSetup.js"
import authRouter from "./routes/auth.routes.js"
import groupRouter from "./routes/group.routes.js"
import moduleRouter from "./routes/module.routes.js"
import reportRouter from "./routes/report.routes.js"

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

app.use('/auth', authRouter)
app.use('/group', groupRouter)
app.use('/module', moduleRouter)
app.use('/report', reportRouter)

export default app;
