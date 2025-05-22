import express from 'express';
import User from '../../models/user';
import { CustomRequest } from '../../types/customRequest';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/profile', async (req, res) => {
    try {
        const userId = (req as CustomRequest).user?.id;
        
        if (!userId) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
        });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json(user);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error Interno en el servidor, Comuniquese con el administrador" });
    }
});

router.get('/verify', async (req, res) => {
    try {
        const user = (req as CustomRequest).user;
        let responseA: { message: string; token?: string; exp?: number } = { message: "ok" };

        if (user?.remember && user.exp) {
            const payload = { ...user };
            const compare = compare3Days(user.exp, Math.floor(Date.now() / 1000));
            if (compare) {
                delete (payload as any).iat;
                delete (payload as any).exp;

                const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
                    expiresIn: "7d",
                });

                const decoded = jwt.decode(token) as { exp: number };
                responseA = { ...responseA, token, exp: decoded.exp };
            }
        }
        return res.json(responseA);
    } catch (error) {
        if (process.env.MODE !== "PROD") console.error(error);
        return res.status(500).json({ message: "Error interno, contacte al administrador para informar del problema." });
    }
});

function compare3Days(expires: number, actual: number): boolean {
    const threeDaysInSeconds = 3 * 24 * 60 * 60;
    const difference = expires - actual;
    return Math.abs(difference) < threeDaysInSeconds;
}

export default router;