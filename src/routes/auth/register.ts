import express from 'express';
import User from '../../models/user';
import validateRequired from '../../middlewares/validateRequired';
import bcrypt from 'bcrypt';

const router = express.Router();



export default router;