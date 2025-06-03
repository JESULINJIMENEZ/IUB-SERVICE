import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Area from './area';
import File, { FileAttributes } from './file';

export interface AireAttributes {
    id: number;
    area_id: number;
    name: string;
    file_id: number;


    File?: any;
    file?: FileAttributes;
}

interface AireCreationAttributes extends Optional<AireAttributes, 'id'> { }
class Aire extends Model<AireAttributes, AireCreationAttributes> implements AireAttributes {

    public id!: number;
    public area_id!: number;
    public name!: string;
    public file_id!: number;


    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    File?: any;
}

Aire.init({
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
    name: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    file_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: File,
            key: 'id'
        }

    }
}, {
    tableName: 'aires',
    sequelize,
})

Area.hasMany(Aire, { foreignKey: 'area_id' });
Aire.belongsTo(Area, { foreignKey: 'area_id' });

File.hasOne(Aire, { foreignKey: 'file_id', onDelete: 'CASCADE' });
Aire.belongsTo(File, { foreignKey: 'file_id', onDelete: 'CASCADE' });

Aire.sync()

export default Aire