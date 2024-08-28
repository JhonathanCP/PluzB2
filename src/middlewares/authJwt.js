import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";
import { User } from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) return res.status(403).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, SECRET);
        req.userId = decoded.id;

        const user = await User.findByPk(req.userId, {
            attributes: { exclude: ["password"] },
        });

        if (!user) return res.status(404).json({ message: "No user found" });

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized!" });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const role = await user.getRole();

        if (role.name === "admin") {
            next();
            return;
        }

        return res.status(403).json({ message: "Require Admin Role!" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
};

