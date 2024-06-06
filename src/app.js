import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import {createRoles, createAdmin, createStates} from "./middlewares/initialSetup.js"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js";
import groupRouter from "./routes/group.routes.js"
import moduleRouter from "./routes/module.routes.js"
import reportRouter from "./routes/report.routes.js"
import notificationRouter from "./routes/notification.routes.js";
import accessRequestRouter from "./routes/accessrequet.routes.js";
import accessAuditRouter from "./routes/accessaudit.routes.js";
import mainDependencyRouter from "./routes/maindependency.routes.js";
import dependencyRouter from "./routes/dependency.routes.js";
import PositionRouter from "./routes/position.routes.js";
import RLRouter from "./routes/rl.routes.js";

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
app.use('/user', userRouter)
app.use('/group', groupRouter)
app.use('/module', moduleRouter)
app.use('/report', reportRouter)
app.use('/notification', notificationRouter)
app.use('/accessrequest', accessRequestRouter)
app.use('/accessaudit', accessAuditRouter)
app.use('/maindependency', mainDependencyRouter)
app.use('/dependency', dependencyRouter)
app.use('/rl', RLRouter)
app.use('/position', PositionRouter)

export default app;
