import express from 'express';

// Import midelwares
import auth from './middlewares/auth';
import jwt from './middlewares/jwt';
import verifyRoles from './middlewares/verifyRoles';
// Import routes
import login from './routes/auth/login';
import file from './routes/file/file';
import userInfo from './routes/auth/userInfo';


const router = express();

// Routes file
router.use('/file', jwt, verifyRoles(['admin']), file);

// Routes login
router.use('/login', auth ,login);

//User info
router.use('/user', jwt, userInfo);

// Routes admin

// Routes public 

export default router;