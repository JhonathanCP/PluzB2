import {Role} from "../models/role.model.js";
import {User} from "../models/user.model.js";
import { ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD } from "../config.js";

export const createRoles = async () => {
    try {
        // Count Rows
        const count = await Role.count();

        // Check for existing roles
        if (count > 0) return;

        // Create default Roles
        const values = await Promise.all([
            Role.create({ name: "ADMINISTRADOR" }),
            Role.create({ name: "USUARIO" })
        ]);

        console.log(values);
    } catch (error) {
        console.error(error);
    }
};

export const createAdmin = async () => {
    try {
        // Check for an existing admin user
        const userFound = await User.findOne({ where: { email: ADMIN_EMAIL } });
        console.log("User found:", userFound);

        if (userFound) {
            console.log("Admin user already existss");
            return;
        }

        // Get the 'admin' role
        const adminRole = await Role.findOne({ where: { name: 'admin' } });

        // Create a new admin user
        const newUser = await User.create({
            username: ADMIN_USERNAME,
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            roleId: adminRole.id // Establecer el roleId directamente
        });

        console.log(`New user created: ${newUser.email}`);
    } catch (error) {
        console.error("Error creating admin:", error);
    }
};