import express from 'express';
import File from '../../models/file';
import { upload, processUploadedFiles, deleteFile, getFileUrl, handleMulterError, MulterFiles, validateFilePayload } from '../../utils/fileUtils';

const router = express.Router();
router.use(handleMulterError);

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

// POST 
router.post('/', async (req, res) => {
    try {

        upload.fields([ { name: 'mainFile', maxCount: 1 }, { name: 'additionalFiles', maxCount: 5 } ])(req, res, async (err) => {

            if (err) return res.status(400).json({
                error: err.message,
                details: 'Los campos deben ser: mainFile (archivo único) y additionalFiles (múltiples archivos)'
            });

            if (!req.body.name) {
                return res.status(400).json({ error: 'El nombre es requerido' });
            }

            const files = req.files as MulterFiles;
            if (!validateFilePayload(files)) {
                return res.status(400).json({ error: 'Archivos no válidos' });
            }

            try {

                const mainFileInfo = files['mainFile']?.[0] ? processUploadedFiles([files['mainFile'][0]])[0] : null;
                const additionalFilesInfo = files['additionalFiles'] ? processUploadedFiles(files['additionalFiles']) : [];

                const newFile = await File.create({
                    name: req.body.name,
                    mainFile: mainFileInfo,
                    additionalFiles: additionalFilesInfo
                });

                return res.status(201).json(newFile);

            } catch (error) {
                await cleanupFiles(files);
                console.error('Error al crear registro:', error);
                return res.status(500).json({ error: 'Error al crear registro' });
            }
        });

    } catch (error) {
        console.error('Error en el proceso:', error);
        return res.status(500).json({ error: 'Error en el proceso' });
    }
});

// GET ALL
router.get('/', async (req, res) => {
    try {

        const files = await File.findAll();

        const transformedFiles = files.map(file => {
            const fileData = file.toJSON();
            
            // Transformar mainFile url
            if (fileData.mainFile && fileData.mainFile.url) {
                fileData.mainFile.url = getFileUrl(fileData.mainFile.url);
            }
            
            // Transformar additionalFiles urls
            if (fileData.additionalFiles && Array.isArray(fileData.additionalFiles)) {
                fileData.additionalFiles = fileData.additionalFiles.map(additionalFile => {
                    if (additionalFile.url) {
                        additionalFile.url = getFileUrl(additionalFile.url);
                    }
                    return additionalFile;
                });
            }
            
            return fileData;
        });

        return res.status(200).json(transformedFiles);

    } catch (error) {
        console.error('Error al obtener archivos:', error);
        return res.status(500).json({ error: 'Error al obtener archivos' });
    }
});

// GET BY ID
router.get('/:id', async (req, res) => {
    try {
        const file = await File.findByPk(req.params.id);

        if (!file) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }

        if (file.mainFile && file.mainFile.url) {
            file.mainFile.url = getFileUrl(file.mainFile.url);
        }

        if (file.additionalFiles && Array.isArray(file.additionalFiles)) {
            file.additionalFiles = file.additionalFiles.map(additionalFile => {
                if (additionalFile.url) {
                    additionalFile.url = getFileUrl(additionalFile.url);
                }
                return additionalFile;
            });
        }

        return res.status(200).json(file);

    } catch (error) {
        console.error('Error al obtener archivo:', error);
        return res.status(500).json({ error: 'Error al obtener archivo' });
    }
});

// PUT 
router.put('/:id', async (req, res) => {
    try {

        const file = await File.findByPk(req.params.id);

        if (!file) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }

        upload.fields([ { name: 'mainFile', maxCount: 1 }, { name: 'additionalFiles', maxCount: 5 } ])(req, res, async (err) => {

            if (err) return res.status(400).json({ error: err.message });

            const files = req.files as MulterFiles;
            if (!validateFilePayload(files)) {
                return res.status(400).json({ error: 'Archivos no válidos' });
            }

            try {
                let mainFileInfo = file.mainFile;
                if (files['mainFile']?.[0]) {
                    if (file.mainFile) await deleteFile(file.mainFile.path);
                    mainFileInfo = processUploadedFiles([files['mainFile'][0]])[0];
                }

                let additionalFilesInfo = file.additionalFiles || [];
                if (files['additionalFiles']) {
                    if (file.additionalFiles) {
                        for (const oldFile of file.additionalFiles) {
                            await deleteFile(oldFile.path);
                        }
                    }
                    additionalFilesInfo = processUploadedFiles(files['additionalFiles']);
                }

                await file.update({
                    name: req.body.name || file.name,
                    mainFile: mainFileInfo,
                    additionalFiles: additionalFilesInfo
                });

                return res.status(200).json(file);
            } catch (error) {
                await cleanupFiles(files);
                console.error('Error al actualizar:', error);
                return res.status(500).json({ error: 'Error al actualizar' });
            }
        });

    } catch (error) {
        console.error('Error en el proceso:', error);
        return res.status(500).json({ error: 'Error en el proceso' });
    }
});

// DELETE 
router.delete('/:id', async (req, res) => {
    try {
        const file = await File.findByPk(req.params.id);
        
        if (!file) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }

        // Eliminar archivo principal
        if (file.mainFile) {
            await deleteFile(file.mainFile.path);
        }

        // Eliminar archivos adicionales
        if (file.additionalFiles) {
            for (const fileInfo of file.additionalFiles) {
                await deleteFile(fileInfo.path);
            }
        }

        await file.destroy();
        return res.status(200).json({ message: 'Archivo eliminado correctamente' });
        
    } catch (error) {
        console.error('Error al eliminar archivo:', error);
        return res.status(500).json({ error: 'Error al eliminar archivo' });
    }
});

export default router;