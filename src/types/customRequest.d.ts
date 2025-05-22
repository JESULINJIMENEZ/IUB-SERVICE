import { Request } from 'express';
import { UserAttributes } from '../models/user';

export interface UserJwtPayload extends UserAttributes {
    exp?: number;
    iat?: number;
    remember?: boolean;
}

export interface CustomRequest extends Request {
    user?: UserJwtPayload;
}
