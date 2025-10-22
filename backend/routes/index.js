import express from'express';
import authroutes from './authroutes.js';
import workspaceroutes from './workspaceRoutes.js';

const router=express.Router();

router.use('/auth',authroutes);
router.use('/workspaces',workspaceroutes);

export default router;