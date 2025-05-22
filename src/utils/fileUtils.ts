import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

export interface FileInfo {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
    url?: string;
}

export interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
}

// Configuración del almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        const uploadPath = path.join(__dirname, '../../uploads');

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// Filtro de tipos de archivo
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Tipo de archivo no permitido. Permitidos: ${allowedTypes.join(', ')}`));
    }
};

// Configuración de multer
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, 
    }
});

// Función para procesar los archivos subidos y preparar para guardar en BD
export const processUploadedFiles = (files: Express.Multer.File[]): FileInfo[] => {
    return files.map(file => ({
        fieldname: file.fieldname,
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        destination: file.destination,
        filename: file.filename,
        path: file.path,
        size: file.size,
        url: file.filename
    }));
};

// Configuración de multer para subir un solo archivo
export const uploadSingle = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, 
    }
}).single('file'); 

// Configuración de multer para subir múltiples archivos
export const uploadMultiple = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 5
    }
}).array('files', 5); 

// Función para eliminar un archivo
export const deleteFile = async (filePath: string): Promise<boolean> => {
    try {
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
        }
        return true;
    } catch (error) {
        console.error('Error al eliminar archivo:', error);
        return false;
    }
};

// Función para obtener la URL de un archivo
export const getFileUrl = (filename: string): string => {
    return `${process.env.BACKEND_URL_UPLOADS}${filename}`;
};

// Middleware para manejar errores de multer
export const handleMulterError = (
    err: any, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    if (err instanceof multer.MulterError) {
        // Error de multer
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'El archivo excede el tamaño máximo permitido'
            });
        }
        return res.status(400).json({ error: err.message });
    } else if (err) {
        // Otro tipo de error
        return res.status(500).json({ error: err.message });
    }
    next();
};

// Validar payload de archivos
export const validateFilePayload = (files: any): boolean => {
    if (!files) return false;
    
    const hasMainFile = files['mainFile'] && files['mainFile'].length > 0;
    const hasAdditionalFiles = files['additionalFiles'] && files['additionalFiles'].length > 0;
    
    return hasMainFile || hasAdditionalFiles;
};