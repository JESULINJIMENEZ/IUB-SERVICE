import express from 'express';
import validateRequired from '../../../middlewares/validateRequired';
import Area from '../../../models/area';
import Campus from '../../../models/campus';
import Aire from '../../../models/aire';
import { Op } from 'sequelize';
import validator from 'validator';


const router = express.Router();

// Crear un nuevo campus
router.post('/', validateRequired(['name', 'address', 'city']), async (req, res) => {
    try {

        const validateCampus = await Campus.findOne({
            where: {
                name: { [Op.like]: `%${req.body.name}%` },
                address: { [Op.like]: `%${req.body.address}%` }
            }
        })

        if (validateCampus) {
            return res.status(409).json({ error: 'El campus ya existe' });
        }

        const newCampus = await Campus.create({
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
        })

        return res.status(201).json({ message: 'Campus creado exitosamente', campus: newCampus });

    } catch (error) {
        console.error('Error al crear campus:', error);
        return res.status(500).json({ error: 'Error interno en el servidor, Comuniquese con el Administrador' });
    }
});

// Obtener todos los campus
router.get('/', async (req, res) => {
    try {

        const campuses = await Campus.findAll({
            include: [
                {
                    model: Area,
                    attributes: ['id', 'name'],
                },

            ],
            attributes: ['id', 'name', 'address', 'city'],
            order: [['name', 'ASC']]
        });

        return res.status(200).json(campuses);

    } catch (error) {
        console.error('Error al obtener campus:', error);
        return res.status(500).json({ error: 'Error interno en el servidor, Comuniquese con el Administrador' });
    }
});

// Obtener un campus por ID
router.get('/:id', async (req, res) => {
    try {
        if (!validator.isNumeric(req.params.id)) {
            return res.status(400).json({ error: 'El ID del campus debe ser un número' });
        }
        const campus = await Campus.findByPk(req.params.id, {
            include: [
                {
                    model: Area,
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: Aire,
                            attributes: ['id', 'name'],
                        }
                    ]
                },

            ],
            attributes: ['id', 'name', 'address', 'city'],
            order: [['name', 'ASC']]
        })

        if (!campus) {
            return res.status(404).json({ error: 'Campus no encontrado' });
        }

        return res.status(200).json(campus);

    } catch (error) {
        console.error('Error al obtener campus por ID:', error);
        return res.status(500).json({ error: 'Error interno en el servidor, Comuniquese con el Administrador' });
    }
});


// Actualizar un campus por ID
router.put('/:id', validateRequired(['name', 'address', 'city']), async (req, res) => {
    try {
        if (!validator.isNumeric(req.params.id)) {
            return res.status(400).json({ error: 'El ID del campus debe ser un número' });
        }

        const campus = await Campus.findByPk(req.params.id);
        if (!campus) {
            return res.status(404).json({ error: 'Campus no encontrado' });
        }

        // Validar que no exista otro campus con el mismo nombre y dirección
        const existingCampus = await Campus.findOne({
            where: {
                name: { [Op.like]: `%${req.body.name}%` },
                address: { [Op.like]: `%${req.body.address}%` },
                id: { [Op.ne]: req.params.id }
            }
        });
        if (existingCampus) {
            return res.status(409).json({ error: 'Ya existe un campus con ese nombre y dirección' });
        }

        const updatedCampus = await campus.update({
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
        });

        return res.status(200).json({ message: 'Campus actualizado exitosamente', campus: updatedCampus });

    } catch (error) {
        console.error('Error al actualizar campus:', error);
        return res.status(500).json({ error: 'Error interno en el servidor, Comuniquese con el Administrador' });
    }
})

export default router;