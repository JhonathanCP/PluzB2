import { User, Report, Module, Dependency, RL, Position } from '../models/models.js';

export const createUser = async (req, res) => {
    try {
        const { username, firstname, lastname, dni, email, password, cargo, RoleId, DependencyId, ldap, RLId, PositionId } = req.body;

        // Verificar que el email y el username no estén ya en uso
        const existingUser = await User.findOne({ where: { email } });
        const existingUsername = await User.findOne({ where: { username } });

        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        if (existingUsername) {
            return res.status(400).json({ message: 'Username is already in use' });
        }

        // Crear el usuario
        const newUser = await User.create({
            username,
            firstname,
            lastname,
            dni,
            email,
            password,
            cargo,
            RoleId: RoleId || 1, // Asignar un rol por defecto si no se proporciona uno
            DependencyId, // Incluir el DependencyId
            ldap: ldap || true,
            RLId,
            PositionId
        });

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, firstname, lastname, dni, email, password, cargo, RoleId, DependencyId, ldap, RLId, PositionId } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verificar que el email y el username no estén ya en uso por otro usuario
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already in use' });
            }
        }

        if (username && username !== user.username) {
            const existingUsername = await User.findOne({ where: { username } });
            if (existingUsername) {
                return res.status(400).json({ message: 'Username is already in use' });
            }
        }

        // Actualizar el usuario
        await user.update({
            username,
            firstname,
            lastname,
            dni,
            email,
            password,
            cargo,
            RoleId: RoleId || user.RoleId, // Mantener el rol actual si no se proporciona uno nuevo
            DependencyId, // Actualizar el DependencyId
            ldap: ldap !== undefined ? ldap : user.ldap, // Mantener el valor actual de ldap si no se proporciona uno nuevo
            RLId,
            PositionId
        });

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, { include: [Dependency] });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ include: [Dependency] });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// export const createUserGroup = async (req, res) => {
//     try {
//         const { userId, groupId } = req.body;
//         const user = await User.findByPk(userId);
//         const group = await Group.findByPk(groupId);
//         if (!user || !group) {
//             return res.status(404).json({ message: 'User or Group not found' });
//         }
//         const existingRelation = await user.hasGroup(group);
//         if (existingRelation) {
//             return res.status(400).json({ message: 'User is already in this group' });
//         }
//         await user.addGroup(group);
//         res.status(201).json({ message: 'User-Group relationship created successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// export const deleteUserGroup = async (req, res) => {
//     try {
//         const { userId, groupId } = req.body;
//         const user = await User.findByPk(userId);
//         const group = await Group.findByPk(groupId);
//         if (!user || !group) {
//             return res.status(404).json({ message: 'User or Group not found' });
//         }
//         const existingRelation = await user.hasGroup(group);
//         if (!existingRelation) {
//             return res.status(400).json({ message: 'User is not in this group' });
//         }
//         await user.removeGroup(group);
//         res.status(200).json({ message: 'User-Group relationship deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

export const createUserModule = async (req, res) => {
    try {
        const { userId, moduleId } = req.body;
        const user = await User.findByPk(userId);
        const module = await Module.findByPk(moduleId); // Incluimos el grupo al que pertenece el módulo
        if (!user || !module) {
            return res.status(404).json({ message: 'User or Module not found' });
        }
        const existingRelation = await user.hasModule(module);
        if (existingRelation) {
            return res.status(400).json({ message: 'User is already assigned to this module' });
        }
        // Agregamos el módulo y también el grupo al que pertenece al usuario
        await user.addModule(module);
        //await user.addGroup(module.Group);
        res.status(201).json({ message: 'User-Module relationship created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteUserModule = async (req, res) => {
    try {
        const { userId, moduleId } = req.body;
        const user = await User.findByPk(userId);
        const module = await Module.findByPk(moduleId); // Incluimos el grupo al que pertenece el módulo
        if (!user || !module) {
            return res.status(404).json({ message: 'User or Module not found' });
        }
        const existingRelation = await user.hasModule(module);
        if (!existingRelation) {
            return res.status400.json({ message: 'User is not assigned to this module' });
        }
        // Eliminamos el módulo y también el grupo al que pertenece del usuario
        await user.removeModule(module);
        //await user.removeGroup(module.Group);
        res.status(200).json({ message: 'User-Module relationship deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Crear una relación usuario-reporte
export const createUserReport = async (req, res) => {
    try {
        const { userId, reportId } = req.body;
        const user = await User.findByPk(userId);
        const report = await Report.findByPk(reportId, { include: [Module] }); // Solo incluimos el módulo
        if (!user || !report) {
            return res.status(404).json({ message: 'User or Report not found' });
        }
        const existingRelation = await user.hasReport(report);
        if (existingRelation) {
            return res.status(400).json({ message: 'User is already assigned to this report' });
        }
        await user.addReport(report);
        await user.addModule(report.Module);
        res.status(201).json({ message: 'User-Report relationship created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Eliminar una relación usuario-reporte
export const deleteUserReport = async (req, res) => {
    try {
        const { userId, reportId } = req.params;
        const user = await User.findByPk(userId);
        const report = await Report.findByPk(reportId, { include: [Module] }); // Solo incluimos el módulo
        if (!user || !report) {
            return res.status(404).json({ message: 'User or Report not found' });
        }
        const existingRelation = await user.hasReport(report);
        if (!existingRelation) {
            return res.status(400).json({ message: 'User is not assigned to this report' });
        }
        await user.removeReport(report);
        await user.removeModule(report.Module);
        res.status(200).json({ message: 'User-Report relationship deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const addAllData = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Obtener todos los grupos, módulos y reportes
        // const allGroups = await Group.findAll();
        const allModules = await Module.findAll();
        const allReports = await Report.findAll();

        // Verificar si el usuario ya tiene todas las relaciones
        // const userGroups = await user.getGroups();
        const userModules = await user.getModules();
        const userReports = await user.getReports();

        // Filtrar los elementos que el usuario no tiene asociados
        // const groupsToAdd = allGroups.filter(group => !userGroups.some(userGroup => userGroup.id === group.id));
        const modulesToAdd = allModules.filter(module => !userModules.some(userModule => userModule.id === module.id));
        const reportsToAdd = allReports.filter(report => !userReports.some(userReport => userReport.id === report.id));

        // Agregar los elementos filtrados al usuario
        // await user.addGroups(groupsToAdd);
        await user.addModules(modulesToAdd);
        await user.addReports(reportsToAdd);

        res.status(201).json({ message: 'All modules, and reports added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// export const getGroupsByUser = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Obtener el usuario y determinar si incluir todos los reportes
//         const user = await User.findByPk(id);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         let whereCondition = { active: true };
//         if (user.RoleId === 2) {
//             whereCondition = {}; // Si el role es 2, eliminar el filtro de activo
//         }

//         // Obtener los reportes asignados al usuario según el role
//         const userReports = await Report.findAll({
//             include: [{
//                 model: User,
//                 where: { id: id }
//             }],
//             where: whereCondition
//         });

//         // Obtener los reportes que tienen el campo 'free' en true
//         const reportsWithFree = await Report.findAll({
//             where: {
//                 free: true,
//                 ...whereCondition
//             }
//         });

//         // Combinar y filtrar reportes únicos
//         const uniqueReports = [];
//         userReports.forEach(report => {
//             if (!uniqueReports.some(r => r.id === report.id)) {
//                 uniqueReports.push(report);
//             }
//         });
//         reportsWithFree.forEach(report => {
//             if (!uniqueReports.some(r => r.id === report.id)) {
//                 uniqueReports.push(report);
//             }
//         });

//         // Obtener los módulos que contienen estos reportes únicos
//         const modulesWithVisibleReports = await Module.findAll({
//             include: [{
//                 model: Report,
//                 where: {
//                     id: uniqueReports.map(report => report.id)
//                 }
//             }]
//         });

//         // Obtener los grupos que contienen estos módulos
//         const groupsWithVisibleModules = await Group.findAll({
//             include: [{
//                 model: Module,
//                 where: {
//                     id: modulesWithVisibleReports.map(module => module.id)
//                 },
//                 include: [Report]
//             }]
//         });

//         res.json({ groups: groupsWithVisibleModules });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

export const getModulesByUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener el usuario y determinar si incluir todos los reportes
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let whereCondition = { active: true };
        if (user.RoleId === 2) {
            whereCondition = {}; // Si el role es 2, eliminar el filtro de activo
        }

        // Obtener los reportes asignados al usuario según el role
        const userReports = await Report.findAll({
            include: [{
                model: User,
                where: { id: id }
            }],
            where: whereCondition
        });

        // Obtener los reportes que tienen el campo 'free' en true
        const reportsWithFree = await Report.findAll({
            where: {
                free: true,
                ...whereCondition
            }
        });

        // Combinar y filtrar reportes únicos
        const uniqueReports = [];
        userReports.forEach(report => {
            if (!uniqueReports.some(r => r.id === report.id)) {
                uniqueReports.push(report);
            }
        });
        reportsWithFree.forEach(report => {
            if (!uniqueReports.some(r => r.id === report.id)) {
                uniqueReports.push(report);
            }
        });

        // Obtener los módulos que contienen estos reportes únicos
        const modulesWithVisibleReports = await Module.findAll({
            include: [{
                model: Report,
                where: {
                    id: uniqueReports.map(report => report.id)
                }
            }]
        });

        res.json({ modules: modulesWithVisibleReports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getReportsByUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener el usuario y determinar si incluir todos los reportes
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let whereCondition = { active: true };
        if (user.RoleId === 2) {
            whereCondition = {}; // Si el role es 2, eliminar el filtro de activo
        }

        // Obtener los reportes asignados al usuario según el role
        const userReports = await Report.findAll({
            include: [{
                model: User,
                where: { id: id }
            }],
            where: whereCondition
        });

        // Obtener los reportes que tienen el campo 'free' en true
        const reportsWithFree = await Report.findAll({
            where: {
                free: true,
                ...whereCondition
            }
        });

        // Array temporal para almacenar los reportes únicos
        const uniqueReports = [];

        // Agregar reportes asignados al usuario
        userReports.forEach(report => {
            if (!uniqueReports.some(r => r.id === report.id)) {
                uniqueReports.push(report.toJSON());
            }
        });

        // Agregar reportes con el campo 'free'
        reportsWithFree.forEach(report => {
            if (!uniqueReports.some(r => r.id === report.id)) {
                uniqueReports.push(report.toJSON());
            }
        });

        res.json({ reports: uniqueReports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const addFavorite = async (req, res) => {
    const { userId, reportId } = req.body;
    try {
        const user = await User.findByPk(userId);
        const report = await Report.findByPk(reportId);
        if (!user || !report) {
            return res.status(404).json({ message: 'User or Report not found' });
        }
        await user.addFavoriteReport(report);
        res.status(201).json({ message: 'Report added to favorites successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const removeFavorite = async (req, res) => {
    const { userId, reportId } = req.params;
    try {
        const user = await User.findByPk(userId);
        const report = await Report.findByPk(reportId);
        if (!user || !report) {
            return res.status(404).json({ message: 'User or Report not found' });
        }
        await user.removeFavoriteReport(report);
        res.status(200).json({ message: 'Report removed from favorites successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getFavorites = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id, {
            include: [{
                model: Report,
                as: 'FavoriteReports'
            }]
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ favoriteReports: user.FavoriteReports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
