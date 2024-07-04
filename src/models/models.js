// Importar Sequelize
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import bcrypt from "bcryptjs";

// Definir el modelo User
export const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    ldap: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

export const RL = sequelize.define('RL', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

export const Position = sequelize.define('Position', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

export const LoginAudit = sequelize.define('LoginAudit', {
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    success: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    publicIp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    privateIp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    system: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export const AccessAudit = sequelize.define('AccessAudit', {
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    success: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    publicIp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    privateIp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    system: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Definir el modelo Role
export const Role = sequelize.define('Role', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

// Definir el modelo State
export const State = sequelize.define('State', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});


// Definir el modelo Dependency
export const MainDependency = sequelize.define('MainDependency', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

export const Dependency = sequelize.define('Dependency', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

// Definir el modelo AccessRequest
export const AccessRequest = sequelize.define('AccessRequest', {
    nombreSolicitante: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pdfBlob: {
        type: DataTypes.BLOB('long'),
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    message: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

// Definir el modelo ImplementationRequest
export const ImplementationRequest = sequelize.define('ImplementationRequest', {
    justification: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pdfBlob: {
        type: DataTypes.BLOB,
        allowNull: true // Puedes ajustar esto según tus necesidades
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    },
    message: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

// Definir el modelo Group
export const Group = sequelize.define('Group', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Definir el modelo Module
export const Module = sequelize.define('Module', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Definir el modelo Report
export const Report = sequelize.define('Report', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    version: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: false
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false
    },
    free: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    limited: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    restricted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    // Permitir que `createdAt` y `updatedAt` sean actualizados manualmente
    timestamps: false,
    updatedAt: 'updatedAt',
    createdAt: 'createdAt'
});

// Definir el modelo Report
export const Notification = sequelize.define('Notification', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shortDescription: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    link: {
        type: DataTypes.STRING,
        allowNull: true
    },
    opened: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    openedAt: {
        type: DataTypes.DATE,
        onUpdate: DataTypes.NOW
    }
});

// Definir el modelo GroupTag
export const GroupTag = sequelize.define('GroupTag', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Definir el modelo Tag
export const Tag = sequelize.define('Tag', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Sequelize hooks for password encryption
User.beforeCreate(async (user) => {
    if (user.changed('password') && user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

User.beforeUpdate(async (user) => {
    if (user.changed('password') && user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

// Sequelize method to compare passwords
User.prototype.comparePassword = async function (password) {
    this.ldap = false; // El usuario se autentica por contraseña
    return await bcrypt.compare(password, this.password);
};

// Nueva función para autenticación LDAP
User.prototype.authenticateLDAP = function () {
    this.ldap = true; // El usuario se autentica por LDAP
};

// Definir las relaciones
AccessRequest.belongsTo(State);
State.hasMany(AccessRequest);

AccessRequest.belongsTo(User);
User.hasMany(AccessRequest);

ImplementationRequest.belongsTo(State);
State.hasMany(ImplementationRequest);

ImplementationRequest.belongsTo(User);
User.hasMany(ImplementationRequest);

User.belongsTo(Role);
Role.hasMany(User);

User.belongsTo(RL);
RL.hasMany(User);

User.belongsTo(Position);
Position.hasMany(User);

Dependency.belongsTo(MainDependency);
MainDependency.hasMany(Dependency);

User.belongsTo(Dependency);
Dependency.hasMany(User);

Notification.belongsTo(User);
User.hasMany(Notification);

User.belongsToMany(Module, { through: 'UserModule' });
Module.belongsToMany(User, { through: 'UserModule' });

User.belongsToMany(Report, { through: 'UserReport' });
Report.belongsToMany(User, { through: 'UserReport' });

User.belongsToMany(Report, {
    through: 'UserFavoriteReport',
    as: 'FavoriteReports'
});
Report.belongsToMany(User, {
    through: 'UserFavoriteReport',
    as: 'FavoritedBy'
});

User.belongsToMany(AccessRequest, {
    through: 'UserReportRequested',
    as: 'Request'
});
AccessRequest.belongsToMany(User, {
    through: 'UserReportRequested',
    as: 'RequestedFor'
});

AccessRequest.belongsToMany(Report, { through: 'AccessRequestReport' });
Report.belongsToMany(AccessRequest, { through: 'AccessRequestReport' });

Tag.belongsToMany(Report, { through: 'TagReport' });
Report.belongsToMany(Tag, { through: 'TagReport' });

Report.belongsTo(Module, { 
    foreignKey: {
        allowNull: false
    },
    required: true
});
Module.hasMany(Report);

Report.belongsTo(Group, { 
    foreignKey: {
        allowNull: false
    },
    required: true
});
Group.hasMany(Report);

LoginAudit.belongsTo(User);
User.hasMany(LoginAudit);

AccessAudit.belongsTo(User);
User.hasMany(AccessAudit);

AccessAudit.belongsTo(Report);
Report.hasOne(AccessAudit);