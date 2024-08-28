import { Router } from "express";
import { signinHandler } from "../controllers/auth.controller.js"

const authRouter = Router()

authRouter.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

authRouter.post('/login', signinHandler);

export default authRouter;