import express from 'express';

// Import midelwares
import auth from './middlewares/auth';
import jwt from './middlewares/jwt';
import verifyRoles from './middlewares/verifyRoles';
// Import routes
import login from './routes/auth/login';
import file from './routes/file/file';
import userInfo from './routes/auth/userInfo';

// Import routes for admin
import route_admin_aires from './routes/admin/aire/aire.routes';
import route_admin_campus from './routes/admin/campus/campus.route';
import route_admin_area from './routes/admin/area/area.route';





const router = express();

// Routes file
router.use('/file', file);

// Routes login
router.use('/login', auth ,login);

//User info
router.use('/user', jwt, userInfo);

// Routes admin
router.use('/admin/aire', jwt , verifyRoles(['admin']), route_admin_aires);
router.use('/admin/campus', jwt , verifyRoles(['admin']), route_admin_campus);
router.use('/admin/area', jwt , verifyRoles(['admin']), route_admin_area);

// Routes public 

export default router;