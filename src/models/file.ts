import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { FileInfo } from '../utils/fileUtils';

export interface FileAttributes {
    id: number;
    name: string;
    mainFile?: FileInfo | null;     
    additionalFiles?: FileInfo[];
    createdAt?: Date;
    updatedAt?: Date;
}

interface FileCreationAttributes extends Optional<FileAttributes, 'id'> { }

class File extends Model<FileAttributes, FileCreationAttributes> implements FileAttributes {
    public id!: number;
    public name!: string;
    public mainFile!: FileInfo | null;
    public additionalFiles!: FileInfo[];
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

File.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        mainFile: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        additionalFiles: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        }
    },
    {
        tableName: 'files',
        sequelize,
    }
);

export default File;
