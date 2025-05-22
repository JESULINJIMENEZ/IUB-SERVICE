import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Area from './area';

export interface reporteAttributes {
    id: number;
    area_id: number;
    name_user: string;
    tipo_user?: string;
    date_reporte: string;
    dni?: string;
    falla: string;
    descripcion: string;
    estado: string;
    foto: string;
    date_seguimiento: string;
    fecha_cierre: string;
}

interface reporteCreationAttributes extends Optional<reporteAttributes, 'id'> { }
class Reporte extends Model<reporteAttributes, reporteCreationAttributes> implements reporteAttributes {
    public id!: number;
    public area_id!: number;
    public name_user!: string;
    public tipo_user?: string;
    public date_reporte!: string;
    public dni?: string;
    public falla!: string;
    public descripcion!: string;
    public estado!: string;
    public foto!: string;
    public date_seguimiento!: string;
    public fecha_cierre!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
Reporte.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    area_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Area,
            key: 'id'
        }
    },
    name_user: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    tipo_user: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    date_reporte: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    dni: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    falla: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },

    foto: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    date_seguimiento: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    fecha_cierre: {
        type: DataTypes.STRING(128),
        allowNull: true,
    }
}, {
    tableName: 'reporte',
    sequelize,
})

Area.hasMany(Reporte, { foreignKey: 'area_id', sourceKey: 'id' });
Reporte.belongsTo(Area, { foreignKey: 'area_id', targetKey: 'id' });
export default Reporte;