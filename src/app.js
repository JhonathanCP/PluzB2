import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { createRoles, createAdmin } from "./middlewares/initialSetup.js"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import clientRouter from "./routes/client.routes.js";
import groupRouter from "./routes/group.routes.js";
import sectionRouter from "./routes/section.routes.js";
import sectionTypeRouter from "./routes/sectiontype.routes.js";
import locationRouter from "./routes/location.routes.js";
import roleRouter from "./routes/role.routes.js";
import groupServicesRouter from "./routes/groupservices.routes.js";
import serviceSectionRouter from "./routes/servicesection.routes.js";
import serviceProfileRouter from "./routes/serviceprofile.routes.js";
import dataRouter from "./routes/data.routes.js";

const app = express();
createRoles();
createAdmin();

app.use(
    cors()
);

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

app.use('/auth', authRouter)
app.use('/role', roleRouter)
app.use('/user', userRouter)
app.use('/client', clientRouter)
app.use('/group', groupRouter)
app.use('/section', sectionRouter)
app.use('/sectiontype', sectionTypeRouter)
app.use('/location', locationRouter)
app.use('/group-services', groupServicesRouter)
app.use('/service-section', serviceSectionRouter)
app.use('/service-profile', serviceProfileRouter)
app.use('/data', dataRouter)

export default app;