import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Campus from './campus';
export interface AreaAttributes {
    id: number;
    campus_id: number;
    name: string;
}

interface AreaCreationAttributes extends Optional<AreaAttributes, 'id'> { }

class Area extends Model<AreaAttributes, AreaCreationAttributes> implements AreaAttributes {
    public id!: number;
    public campus_id!: number;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Area.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    campus_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references:{
            model: Campus,
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(128),
        allowNull: false,
    }
}, {
    tableName: 'areas',
    sequelize,
})

Campus.hasMany(Area, {foreignKey: 'campus_id' });
Area.belongsTo(Campus, {foreignKey: 'campus_id'});

Area.sync()

export default Area;