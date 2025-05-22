import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Area from './area';
import User from './user';

export interface InspreccionesAttributes {
    id: number;
    area_id: number;
    user_id: number;
    luces: boolean;
    toma_corriente: boolean;
    puerta: boolean;
    techo: boolean;
    aire_goteando: boolean;
    observaciones: string;
}

interface InspeccionesCreationAttributes extends Optional<InspreccionesAttributes, 'id'> { }
class Inspecciones extends Model<InspreccionesAttributes, InspeccionesCreationAttributes> implements InspreccionesAttributes {
    public id!: number;
    public area_id!: number;
    public user_id!: number;
    public luces!: boolean;
    public toma_corriente!: boolean;
    public puerta!: boolean;
    public techo!: boolean;
    public aire_goteando!: boolean;
    public observaciones!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
Inspecciones.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    area_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Area,
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    luces: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    toma_corriente: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    puerta: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    techo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    aire_goteando: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    observaciones: {
        type: DataTypes.STRING(128),
        allowNull: false,
    }
}, {
    tableName: 'inspecciones',
    sequelize,
});

Area.hasMany(Inspecciones, { foreignKey: 'area_id' });
Inspecciones.belongsTo(Area, { foreignKey: 'area_id', });

User.hasMany(Inspecciones, { foreignKey: 'user_id'});
Inspecciones.belongsTo(User, { foreignKey: 'user_id'});

Inspecciones.sync()

export default Inspecciones;