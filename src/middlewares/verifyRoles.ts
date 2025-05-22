// src/middlewares/verifyRoles.ts
import { Request, Response, NextFunction } from 'express';
import { UserAttributes } from '../models/user';
import { CustomRequest } from '../types/customRequest'; // Importa la interfaz UserAttributes

const verifyRoles = (allowedRoles: string[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {

        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }

        const user = req.user as UserAttributes;

        const hasPermission = allowedRoles.includes(user.role);

        if (!hasPermission) {
            return res.status(403).json({ message: 'No tienes permiso para acceder a este recurso.' });
        }

        next();
    };
};

export default verifyRoles;