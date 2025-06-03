import express from 'express';
import Aire from '../../../models/aire';
import validateRequired from '../../../middlewares/validateRequired';
import File from '../../../models/file';
import { upload, processUploadedFiles, deleteFile, getFileUrl, handleMulterError, MulterFiles, validateFilePayload } from '../../../utils/fileUtils';
import Area from '../../../models/area';

const router = express.Router();


// Función helper para limpiar archivos
const cleanupFiles = async (files: MulterFiles) => {
    if (files['mainFile']?.[0]) {
        await deleteFile(files['mainFile'][0].path);
    }
    if (files['additionalFiles']) {
        for (const file of files['additionalFiles']) {
            await deleteFile(file.path);
        }
    }
};

// Ruta para crear un nuevo aire
router.post('/', async (req, res) => {
    try {
        upload.fields([{ name: 'mainFile', maxCount: 1 }, { name: 'additionalFiles', maxCount: 5 }])(req, res, async (err) => {
            if (err) return res.status(400).json({
                error: err.message,
                details: 'Los campos deben ser: mainFile (archivo único) y additionalFiles (múltiples archivos)'
            });

            console.log('Archivos recibidos:', req.files);

            console.log('Cuerpo de la solicitud:', req.body);

            if (!req.body.aireName || !req.body.area_id) {
                return res.status(400).json({ error: 'El nombre y el area_id son requeridos' });
            }

            const files = req.files as MulterFiles;
            if (!validateFilePayload(files)) {
                return res.status(400).json({ error: 'Archivos no válidos' });
            }

            try {
                // 1. Procesar archivos y crear registro en File
                const mainFileInfo = files['mainFile']?.[0] ? processUploadedFiles([files['mainFile'][0]])[0] : null;
                const additionalFilesInfo = files['additionalFiles'] ? processUploadedFiles(files['additionalFiles']) : [];

                const newFile = await File.create({
                    name: req.body.fileName,
                    mainFile: mainFileInfo,
                    additionalFiles: additionalFilesInfo
                });

                const validateArea = await Area.findByPk(req.body.area_id);
                if (!validateArea) {
                    return res.status(404).json({ error: 'Área no encontrada' });
                }

                // 2. Crear registro en Aire usando el id del archivo creado
                const newAire = await Aire.create({
                    name: req.body.aireName,
                    area_id: req.body.area_id,
                    file_id: newFile.id
                });

                return res.status(201).json(newAire);

            } catch (error) {
                await cleanupFiles(files);
                console.error('Error al crear aire:', error);
                return res.status(500).json({ error: 'Error al crear aire' });
            }
        });
    } catch (error) {
        console.error('Error al crear aire:', error);
        return res.status(500).json({ message: 'Error interno en el servidor, comuniquese con el administrador' });
    }
});

// Ruta para obtener todos los aires
router.get('/', async (req, res) => {
    try {
        const aires = await Aire.findAll({
            include: [{
                model: File,
                attributes: ['id', 'name', 'mainFile', 'additionalFiles']
            }]
        });

        if (aires.length === 0) {
            return res.status(404).json({ message: 'No se encontraron aires' });
        }

        // Transformar las URLs de los archivos asociados
        const transformedAires = aires.map(aire => {
            const aireData = aire.toJSON();
            if (aireData.File) {
                // Transformar mainFile url
                if (aireData.File.mainFile && aireData.File.mainFile.url) {
                    aireData.File.mainFile.url = getFileUrl(aireData.File.mainFile.url);
                }
                // Transformar additionalFiles urls
                if (aireData.File.additionalFiles && Array.isArray(aireData.File.additionalFiles)) {
                    aireData.File.additionalFiles = aireData.File.additionalFiles.map((additionalFile: any) => {
                        if (additionalFile.url) {
                            additionalFile.url = getFileUrl(additionalFile.url);
                        }
                        return additionalFile;
                    });
                }
            }
            return aireData;
        });
        // ...código existente...

        return res.status(200).json(transformedAires);

    } catch (error) {
        console.error('Error al obtener aires:', error);
        return res.status(500).json({ message: 'Error interno en el servidor, comuniquese con el administrador' });
    }
});


// Ruta para obtener un aire por ID
router.get('/:id', async (req, res) => {
    try {
        const aire = await Aire.findByPk(req.params.id, {
            include: [{
                model: File,
                attributes: ['id', 'name', 'mainFile', 'additionalFiles']
            }]
        });
        if (!aire) {
            return res.status(404).json({ message: 'Aire no encontrado' });
        }
        const aireData = aire.toJSON();
        // Transformar mainFile url
        if (aireData.File && aireData.File.mainFile && aireData.File.mainFile.url) {
            aireData.File.mainFile.url = getFileUrl(aireData.File.mainFile.url);
        }
        // Transformar additionalFiles urls
        if (aireData.File && aireData.File.additionalFiles && Array.isArray(aireData.File.additionalFiles)) {
            aireData.File.additionalFiles = aireData.File.additionalFiles.map((additionalFile: any) => {
                if (additionalFile.url) {
                    additionalFile.url = getFileUrl(additionalFile.url);
                }
                return additionalFile;
            });
        }
        return res.status(200).json(aireData);
    } catch (error) {
        console.error('Error al obtener aire por ID:', error);
        return res.status(500).json({ message: 'Error interno en el servidor, comuniquese con el administrador' });
    }
});

// Ruta para actualizar un aire
router.put('/:id', async (req, res) => {
    try {
        upload.fields([{ name: 'mainFile', maxCount: 1 }, { name: 'additionalFiles', maxCount: 5 }])(req, res, async (err) => {
            if (err) return res.status(400).json({
                error: err.message,
                details: 'Los campos deben ser: mainFile (archivo único) y additionalFiles (múltiples archivos)'
            });

            const aire = await Aire.findByPk(req.params.id, {
                include: [{
                    model: File,
                    attributes: ['id', 'name', 'mainFile', 'additionalFiles']
                }]
            });
            if (!aire) {
                return res.status(404).json({ message: 'Aire no encontrado' });
            }

            const files = req.files as MulterFiles;
            if (!validateFilePayload(files) && !req.body.aireName && !req.body.area_id && !req.body.fileName) {
                return res.status(400).json({ error: 'No hay datos para actualizar' });
            }

            try {
                // Actualizar archivo si se subieron nuevos
                let fileToUpdate = aire.File;
                if (fileToUpdate) {
                    // Actualizar mainFile si hay uno nuevo
                    if (files['mainFile']?.[0]) {
                        if (fileToUpdate.mainFile) await deleteFile(fileToUpdate.mainFile.path);
                        fileToUpdate.mainFile = processUploadedFiles([files['mainFile'][0]])[0];
                    }
                    // Actualizar additionalFiles si hay nuevos
                    if (files['additionalFiles']) {
                        if (fileToUpdate.additionalFiles) {
                            for (const oldFile of fileToUpdate.additionalFiles) {
                                await deleteFile(oldFile.path);
                            }
                        }
                        fileToUpdate.additionalFiles = processUploadedFiles(files['additionalFiles']);
                    }
                    // Actualizar nombre del archivo si se envía
                    if (req.body.fileName) {
                        fileToUpdate.name = req.body.fileName;
                    }
                    await fileToUpdate.save();
                }

                // Validar área si se envía area_id
                if (req.body.area_id) {
                    const validateArea = await Area.findByPk(req.body.area_id);
                    if (!validateArea) {
                        return res.status(404).json({ error: 'Área no encontrada' });
                    }
                    aire.area_id = req.body.area_id;
                }

                // Actualizar nombre del aire si se envía
                if (req.body.aireName) {
                    aire.name = req.body.aireName;
                }

                await aire.save();

                // Obtener aire actualizado con archivos
                const updatedAire = await Aire.findByPk(aire.id, {
                    include: [{
                        model: File,
                        attributes: ['id', 'name', 'mainFile', 'additionalFiles']
                    }]
                });

                // Transformar URLs de archivos
                const aireData = updatedAire?.toJSON();
                if (aireData?.File) {
                    if (aireData.File.mainFile && aireData.File.mainFile.url) {
                        aireData.File.mainFile.url = getFileUrl(aireData.File.mainFile.url);
                    }
                    if (aireData.File.additionalFiles && Array.isArray(aireData.File.additionalFiles)) {
                        aireData.File.additionalFiles = aireData.File.additionalFiles.map((additionalFile: any) => {
                            if (additionalFile.url) {
                                additionalFile.url = getFileUrl(additionalFile.url);
                            }
                            return additionalFile;
                        });
                    }
                }

                return res.status(200).json(aireData);

            } catch (error) {
                await cleanupFiles(files);
                console.error('Error al actualizar aire:', error);
                return res.status(500).json({ error: 'Error al actualizar aire' });
            }
        });
    } catch (error) {
        console.error('Error al actualizar aire:', error);
        return res.status(500).json({ message: 'Error interno en el servidor, comuniquese con el administrador' });
    }
});

// Ruta para eliminar un aire
router.delete('/:id', async (req, res) => {
    try {

        const aire = await Aire.findByPk(req.params.id);

        if (!aire) {
            return res.status(404).json({ message: 'Aire no encontrado' });
        }
        await aire.destroy();

        return res.status(200).json({ message: 'Aire eliminado exitosamente' });

    } catch (error) {
        console.error('Error al eliminar aire:', error);
        return res.status(500).json({ message: 'Error interno en el servidor, comuniquese con el administrador' });
    }
});

export default router;