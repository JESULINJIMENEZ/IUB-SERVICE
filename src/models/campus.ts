import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface CampusAttributes {
    id: number;
    name: string;
    address: string;
    city: string;
}

interface CampusCreationAttributes extends Optional<CampusAttributes, 'id'> { }
class Campus extends Model<CampusAttributes, CampusCreationAttributes> implements CampusAttributes {
    public id!: number;
    public name!: string;
    public address!: string;
    public city!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Campus.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    name: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING(128),
        allowNull: false,
    }
}, {
    tableName: 'campus',
    sequelize,
});

Campus.sync()


export default Campus;
