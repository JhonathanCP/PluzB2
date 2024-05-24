import { User, Report, Module, Group } from '../models/models.js';

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        
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
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createUserGroup = async (req, res) => {
    try {
        const { userId, groupId } = req.body;
        const user = await User.findByPk(userId);
        const group = await Group.findByPk(groupId);
        if (!user || !group) {
            return res.status(404).json({ message: 'User or Group not found' });
        }
        const existingRelation = await user.hasGroup(group);
        if (existingRelation) {
            return res.status(400).json({ message: 'User is already in this group' });
        }
        await user.addGroup(group);
        res.status(201).json({ message: 'User-Group relationship created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteUserGroup = async (req, res) => {
    try {
        const { userId, groupId } = req.body;
        const user = await User.findByPk(userId);
        const group = await Group.findByPk(groupId);
        if (!user || !group) {
            return res.status(404).json({ message: 'User or Group not found' });
        }
        const existingRelation = await user.hasGroup(group);
        if (!existingRelation) {
            return res.status(400).json({ message: 'User is not in this group' });
        }
        await user.removeGroup(group);
        res.status(200).json({ message: 'User-Group relationship deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createUserModule = async (req, res) => {
    try {
        const { userId, moduleId } = req.body;
        const user = await User.findByPk(userId);
        const module = await Module.findByPk(moduleId, { include: [Group] }); // Incluimos el grupo al que pertenece el módulo
        if (!user || !module) {
            return res.status(404).json({ message: 'User or Module not found' });
        }
        const existingRelation = await user.hasModule(module);
        if (existingRelation) {
            return res.status(400).json({ message: 'User is already assigned to this module' });
        }
        // Agregamos el módulo y también el grupo al que pertenece al usuario
        await user.addModule(module);
        await user.addGroup(module.Group);
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
        const module = await Module.findByPk(moduleId, { include: [Group] }); // Incluimos el grupo al que pertenece el módulo
        if (!user || !module) {
            return res.status(404).json({ message: 'User or Module not found' });
        }
        const existingRelation = await user.hasModule(module);
        if (!existingRelation) {
            return res.status(400).json({ message: 'User is not assigned to this module' });
        }
        // Eliminamos el módulo y también el grupo al que pertenece del usuario
        await user.removeModule(module);
        await user.removeGroup(module.Group);
        res.status(200).json({ message: 'User-Module relationship deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createUserReport = async (req, res) => {
    try {
        const { userId, reportId } = req.body;
        const user = await User.findByPk(userId);
        const report = await Report.findByPk(reportId, { include: [{ model: Module, include: [Group] }] }); // Incluimos el módulo y el grupo al que pertenece el reporte
        if (!user || !report) {
            return res.status(404).json({ message: 'User or Report not found' });
        }
        const existingRelation = await user.hasReport(report);
        if (existingRelation) {
            return res.status(400).json({ message: 'User is already assigned to this report' });
        }
        // Agregamos el reporte, el módulo y también el grupo al que pertenece al usuario
        await user.addReport(report);
        await user.addModule(report.Module);
        await user.addGroup(report.Module.Group);
        res.status(201).json({ message: 'User-Report relationship created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteUserReport = async (req, res) => {
    try {
        const { userId, reportId } = req.params;
        const user = await User.findByPk(userId);
        const report = await Report.findByPk(reportId, { include: [{ model: Module, include: [Group] }] }); // Incluimos el módulo y el grupo al que pertenece el reporte
        if (!user || !report) {
            return res.status(404).json({ message: 'User or Report not found' });
        }
        const existingRelation = await user.hasReport(report);
        if (!existingRelation) {
            return res.status(400).json({ message: 'User is not assigned to this report' });
        }
        // Eliminamos el reporte, el módulo y también el grupo al que pertenece del usuario
        await user.removeReport(report);
        await user.removeModule(report.Module);
        await user.removeGroup(report.Module.Group);
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
        const allGroups = await Group.findAll();
        const allModules = await Module.findAll();
        const allReports = await Report.findAll();

        // Verificar si el usuario ya tiene todas las relaciones
        const userGroups = await user.getGroups();
        const userModules = await user.getModules();
        const userReports = await user.getReports();

        // Filtrar los elementos que el usuario no tiene asociados
        const groupsToAdd = allGroups.filter(group => !userGroups.some(userGroup => userGroup.id === group.id));
        const modulesToAdd = allModules.filter(module => !userModules.some(userModule => userModule.id === module.id));
        const reportsToAdd = allReports.filter(report => !userReports.some(userReport => userReport.id === report.id));

        // Agregar los elementos filtrados al usuario
        await user.addGroups(groupsToAdd);
        await user.addModules(modulesToAdd);
        await user.addReports(reportsToAdd);

        res.status(201).json({ message: 'All groups, modules, and reports added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controlador para obtener los grupos asignados a un usuario específico y los grupos que tienen al menos un reporte gratuito
export const getGroupsByUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Obtener los grupos asignados al usuario
        const user = await User.findByPk(id, { include: Group });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userGroups = user.Groups;

        let whereCondition = { free: true, active: true };
        if (user.RoleId === 2) {
            whereCondition = {}; // Si el role es 2, eliminar el filtro de free
        }

        // Obtener los grupos que tienen al menos un reporte, ajustando el filtro por el role del usuario
        const groupsWithFreeReport = await Group.findAll({
            include: {
                model: Module,
                include: {
                    model: Report,
                    where: whereCondition, // Aplicar la condición modificada según el role
                    required: true // Asegura que solo se incluyan los módulos con al menos un reporte que cumpla la condición
                }
            }
        });

        const filteredGroupsWithFreeReport = groupsWithFreeReport.filter(group => group.Modules.length > 0);

        // Array temporal para almacenar los grupos únicos
        const uniqueGroups = [];

        // Agregar grupos asignados al usuario
        userGroups.forEach(group => {
            if (!uniqueGroups.some(g => g.id === group.id)) {
                uniqueGroups.push(group);
            }
        });

        // Agregar grupos con al menos un reporte según la condición de free o todos si role es 2
        filteredGroupsWithFreeReport.forEach(group => {
            if (!uniqueGroups.some(g => g.id === group.id)) {
                uniqueGroups.push(group.toJSON()); // Convertir el objeto Sequelize a JSON
            }
        });

        res.json({ groups: uniqueGroups });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



export const getModulesByUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Obtener los módulos asignados al usuario
        const user = await User.findByPk(id, { include: Module });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userModules = user.Modules;

        let whereCondition = { free: true, active: true };
        if (user.RoleId === 2) {
            whereCondition = {}; // Si el role es 2, eliminar el filtro de free
        }

        // Obtener los módulos que tienen al menos un reporte que cumple la condición ajustada según el role
        const modulesWithFreeReport = await Module.findAll({
            include: {
                model: Report,
                where: whereCondition, // Aplicar la condición modificada según el role
                required: true // Solo se incluirán los reportes que cumplen la condición
            }
        });

        const filteredModulesWithFreeReport = modulesWithFreeReport.filter(module => module.Reports.length > 0);

        // Array temporal para almacenar los módulos únicos
        const uniqueModules = [];

        // Agregar módulos asignados al usuario
        userModules.forEach(module => {
            if (!uniqueModules.some(m => m.id === module.id)) {
                uniqueModules.push(module);
            }
        });

        // Agregar módulos con al menos un reporte que cumple la condición
        filteredModulesWithFreeReport.forEach(module => {
            if (!uniqueModules.some(m => m.id === module.id)) {
                uniqueModules.push(module.toJSON()); // Convertir el objeto Sequelize a JSON
            }
        });

        res.json({ modules: uniqueModules });
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

        // let whereCondition = { active: true };
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
        // Y ajustar para incluir inactivos si el role es 2
        const reportsWithFree = await Report.findAll({
            where: {
                free: true,
                ...whereCondition // Usar la misma condición determinada por el role
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
