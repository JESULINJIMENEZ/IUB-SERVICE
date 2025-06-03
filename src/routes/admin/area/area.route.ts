import express from 'express';
import validateRequired from '../../../middlewares/validateRequired';
import Area from '../../../models/area';
import Campus from '../../../models/campus';
import Aire from '../../../models/aire';
import { Op } from 'sequelize';
import validator from 'validator';

const router = express.Router();

//Obtener todas las áreas
router.get('/', async (req, res) => {
    try {

        const areas = await Area.findAll({
            include: [
                {
                    model: Campus,
                    attributes: ['id', 'name']
                },
                {
                    model: Aire,
                    attributes: ['id', 'name'],
                }
            ],
            attributes: ['id', 'campus_id', 'name'],
            order: [['name', 'ASC']]
        });

        return res.status(200).json(areas);

    } catch (error) {
        console.error('Error al obtener áreas:', error);
        return res.status(500).json({ error: 'Error interno en el servidor, Comuniquese con el Administrador' });
    }
});

//Obtener un área por ID
router.get('/:id', async (req, res) => {
    try {

        if (!validator.isInt(req.params.id, { min: 1 })) {
            return res.status(400).json({ error: 'ID de área inválido' });
        }

        const oneArea = await Area.findByPk(req.params.id, {
            include: [
                {
                    model: Campus,
                    attributes: ['id', 'name']
                },
                {
                    model: Aire,
                    attributes: ['id', 'name'],
                }
            ],
            attributes: ['id', 'campus_id', 'name'],
            order: [['name', 'ASC']]
        });

        return res.status(200).json(oneArea);
    } catch (error) {
        console.error('Error al obtener área:', error);
        return res.status(500).json({ error: 'Error interno en el servidor, Comuniquese con el Administrador' });
    }
})

// Crear un área
router.post('/', validateRequired(['campus_id', 'name']), async (req, res) => {
    try {
        const { campus_id, name } = req.body;

        // Verificar si el campus existe
        const campus = await Campus.findByPk(campus_id);
        if (!campus) {
            return res.status(404).json({ error: 'Campus no encontrado' });
        }

        // Verificar si el área ya existe
        const existingArea = await Area.findOne({
            where: {
                [Op.and]: [
                    { campus_id },
                    { name }
                ]
            }
        });

        if (existingArea) {
            return res.status(409).json({ error: 'El área ya existe en este campus' });
        }

        // Crear el área
        const newArea = await Area.create({
            campus_id,
            name
        });

        return res.status(201).json(newArea);

    } catch (error) {
        console.error('Error al crear área:', error);
        return res.status(500).json({ error: 'Error interno en el servidor, Comuniquese con el Administrador' });
    }
});

// Actualizar un área
router.put('/:id', async (req, res) => {
    try {
        if (!validator.isInt(req.params.id, { min: 1 })) {
            return res.status(400).json({ error: 'ID de área inválido' });
        }

        const area = await Area.findByPk(req.params.id);
        if (!area) {
            return res.status(404).json({ error: 'Área no encontrada' });
        }

        const validateCampus = await Campus.findByPk(req.body.campus_id);
        if (!validateCampus) {
            return res.status(404).json({ error: 'Campus no encontrado' });
        }


        area.campus_id = req.body.campus_id || area.campus_id;
        area.name = req.body.name || area.name;
        await area.save();

        const oneArea = await Area.findByPk(req.params.id, {
            include: [
                {
                    model: Campus,
                    attributes: ['id', 'name']
                },
                {
                    model: Aire,
                    attributes: ['id', 'name'],
                }
            ],
            attributes: ['id', 'campus_id', 'name'],
            order: [['name', 'ASC']]
        });

        return res.status(200).json(oneArea);

    } catch (error) {
        console.error('Error al actualizar área:', error);
        return res.status(500).json({ error: 'Error interno en el servidor, Comuniquese con el Administrador' });
    }
});

// Eliminar un área
router.delete('/:id', async (req, res) => {
    try {
        if (!validator.isInt(req.params.id, { min: 1 })) {
            return res.status(400).json({ error: 'ID de área inválido' });
        }

        const area = await Area.findByPk(req.params.id);
        if (!area) {
            return res.status(404).json({ error: 'Área no encontrada' });
        }

        await area.destroy();
        return res.status(204).send();

    } catch (error) {
        console.error('Error al eliminar área:', error);
        return res.status(500).json({ error: 'Error interno en el servidor, Comuniquese con el Administrador' });
    }
});





export default router;