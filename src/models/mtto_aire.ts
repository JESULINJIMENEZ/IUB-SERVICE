import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './user';
import Aire from './aire';

export interface MttoAireAttributes {
    id: number;
    aire_id: number;
    user_id: number;
    fecha: Date;
    descripcion: string;
    photo: string;
    tipo_mantenimiento: string;
}

interface MttoAireCreationAttributes extends Optional<MttoAireAttributes, 'id'> { }
class MttoAire extends Model<MttoAireAttributes, MttoAireCreationAttributes> implements MttoAireAttributes {
    public id!: number;
    public aire_id!: number;
    public user_id!: number;
    public fecha!: Date;
    public descripcion!: string;
    public photo!: string;
    public tipo_mantenimiento!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

MttoAire.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    aire_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Aire,
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
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    photo: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    tipo_mantenimiento: {
        type: DataTypes.STRING(128),
        allowNull: false,
    }
}, {
    tableName: 'mtto_aire',
    sequelize,
});

Aire.hasMany(MttoAire, { foreignKey: 'aire_id'});
MttoAire.belongsTo(Aire, { foreignKey: 'aire_id' });

export default MttoAire;