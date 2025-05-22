import { Request, Response, NextFunction } from 'express';

const validateRequired = (requiredFields: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const missingFields = requiredFields.filter(field => {
            const value = req.body[field];
            return value === undefined || value === null || value === '';
        });

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Missing required fields',
                fields: missingFields
            });
        }

        next();
    };
};

export default validateRequired;