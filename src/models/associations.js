import { User } from "./user.model.js";
import { Role } from "./role.model.js";
import { LoginAudit } from "./loginaudit.model.js";
import { Group } from "./group.model.js";
import { Client } from "./client.model.js";
import { Section } from "./section.model.js";

// Definir la relación uno a muchos: Un rol tiene muchos usuarios, pero un usuario tiene solo un rol
Role.hasMany(User, {
    foreignKey: 'roleId',
    as: 'users'
});
User.belongsTo(Role, {
    foreignKey: 'roleId',
    as: 'role'
});

LoginAudit.belongsTo(User);
User.hasMany(LoginAudit);

Client.belongsTo(Group);
Group.hasMany(Client);

Section.belongsTo(Client);
Client.hasMany(Section);