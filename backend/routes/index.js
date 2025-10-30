import express from'express';
import authroutes from './authroutes.js';
import workspaceroutes from './workspaceRoutes.js';
import projectRoutes from './projectRoutes.js';
import taskRoutes from './taskRoutes.js'
import userprofileRoutes from './userprofileRoutes.js';
const router=express.Router();

router.use('/auth',authroutes);
router.use('/workspaces',workspaceroutes);
router.use('/projects',projectRoutes);
router.use('/tasks',taskRoutes);
router.use('/users',userprofileRoutes);
export default router;