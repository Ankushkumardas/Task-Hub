
import express from 'express';
import { validateRequest } from 'zod-express-middleware';
import { authmiddleware } from '../middlewares/authmiddleware.js';
import { projectSchema } from '../libs/validateschema.js';
import { createProject, getProjectDetails, getProjectTasks } from '../controllers/projectController.js';
import { z } from 'zod';

const router=express.Router();
router.post("/:workspaceid/create-project",authmiddleware,validateRequest({params:z.object({workspaceid:z.string().min(1,"Workspace ID is required")}),body:projectSchema}),createProject);

router.get("/:projectid",authmiddleware,getProjectDetails);

router.get("/:projectid/tasks",authmiddleware,validateRequest({params: z.object({projectid:z.string()})}),getProjectTasks);


export default router;