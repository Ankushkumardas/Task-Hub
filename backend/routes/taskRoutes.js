import express from 'express';
import { createTask, getTaskDetails } from '../controllers/taskcontoller.js';
import {authmiddleware} from '../middlewares/authmiddleware.js'
import { z } from 'zod';
import { validateRequest } from 'zod-express-middleware';
import { taskSchema } from '../libs/validateschema.js';

const router=express.Router();

router.post('/:projectid/create-task',authmiddleware,validateRequest({params:z.object({projectid:z.string()}),body:taskSchema}),createTask)
router.get('/:taskid',authmiddleware,validateRequest({params:z.object({taskid:z.string()})}),getTaskDetails)

export default router;