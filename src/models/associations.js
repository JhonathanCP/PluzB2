import { User } from "./user.model.js";
import { Role } from "./role.model.js";
import { LoginAudit } from "./loginaudit.model.js";
import { Group } from "./group.model.js";
import { Client } from "./client.model.js";
import { Location } from "./location.model.js";
import { Section } from "./section.model.js";
import { SectionType } from "./sectiontype.model.js";
import { GroupServices } from "./groupservices.model.js";
import { ServiceSection } from "./servicesection.model.js";

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

GroupServices.belongsTo(Group);
Group.hasMany(GroupServices);

ServiceSection.belongsTo(GroupServices);
GroupServices.hasMany(ServiceSection);

ServiceSection.belongsTo(SectionType);
SectionType.hasMany(ServiceSection);

Client.belongsTo(Location);
Location.hasMany(Client);

Section.belongsTo(Client);
Client.hasMany(Section);

Section.belongsTo(SectionType);
SectionType.hasMany(Section);
