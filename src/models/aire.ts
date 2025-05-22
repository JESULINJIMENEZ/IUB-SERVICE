import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Area from './area';

export interface AireAttributes {
    id: number;
    area_id: number;
    name: string;
}

interface AireCreationAttributes extends Optional<AireAttributes, 'id'> { }
class Aire extends Model<AireAttributes, AireCreationAttributes> implements AireAttributes {

    public id!: number;
    public area_id!: number;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}   

Aire.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    area_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references:{
            model: Area,
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(128),
        allowNull: false,
    }
}, {
    tableName: 'aires',
    sequelize,
})

Area.hasMany(Aire, {foreignKey: 'area_id', sourceKey: 'id'});
Aire.belongsTo(Area, {foreignKey: 'area_id', targetKey: 'id'});


Aire.sync()

export default Aire