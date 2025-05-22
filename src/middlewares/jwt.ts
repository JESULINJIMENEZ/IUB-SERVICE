// src/middlewares/jwt.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserAttributes } from '../models/user'; 
import { CustomRequest } from '../types/customRequest'; 

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

const jwtMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {

    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        
        const decoded = jwt.verify(token, JWT_SECRET) as UserAttributes;

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({ message: 'Token no válido.' });
    }
};

export default jwtMiddleware;