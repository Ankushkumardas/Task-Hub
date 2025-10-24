import express from'express';
import authroutes from './authroutes.js';
import workspaceroutes from './workspaceRoutes.js';
import projectRoutes from './projectRoutes.js';

const router=express.Router();

router.use('/auth',authroutes);
router.use('/workspaces',workspaceroutes);
router.use('/projects',projectRoutes);

export default router;