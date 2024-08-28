import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { createRoles, createAdmin } from "./middlewares/initialSetup.js"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"

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
app.use('/user', userRouter)

export default app;
