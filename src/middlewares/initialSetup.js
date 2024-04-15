import {Role} from "../models/models.js";
import {User} from "../models/models.js";
import { State } from "../models/models.js";
import { ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD } from "../config.js";

export const createRoles = async () => {
    try {
        // Count Rows
        const count = await Role.count();

        // Check for existing roles
        if (count > 0) return;

        // Create default Roles
        const values = await Promise.all([
            Role.create({ name: "user" }),
            Role.create({ name: "admin" })
        ]);

        console.log(values);
    } catch (error) {
        console.error(error);
    }
};

export const createStates = async () => {
    try {
        // Count Rows
        const count = await State.count();

        // Check for existing roles
        if (count > 0) return;

        // Create default Roles
        const values = await Promise.all([
            State.create({ name: "PENDIENTE DE FIRMA" }),
            State.create({ name: "POR REVISAR" }),
            State.create({ name: "APROBADO" }),
            State.create({ name: "DENEGADO" })
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
            console.log("Admin user already exists");
            return;
        }

        // Get the 'admin' role
        const adminRole = await Role.findOne({ where: { name: 'admin' } });

        // Create a new admin user
        const newUser = await User.create({
            username: ADMIN_USERNAME,
            firstname: 'admin',
            lastname: 'admin',
            dni: '0000000',
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            ldap: false,
            RoleId: adminRole.id // Establecer el roleId directamente
        });

        console.log(`New user created: ${newUser.email}`);
    } catch (error) {
        console.error("Error creating admin:", error);
    }
};