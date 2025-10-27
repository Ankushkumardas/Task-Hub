import express from 'express';
import { createTask, getTaskDetails, updateTaskDescription, updateTaskStatus, updateTasktitle } from '../controllers/taskcontoller.js';
import {authmiddleware} from '../middlewares/authmiddleware.js'
import { z } from 'zod';
import { validateRequest } from 'zod-express-middleware';
import { taskSchema } from '../libs/validateschema.js';

const router=express.Router();

router.post('/:projectid/create-task',authmiddleware,validateRequest({params:z.object({projectid:z.string()}),body:taskSchema}),createTask)
router.get('/:taskid',authmiddleware,validateRequest({params:z.object({taskid:z.string()})}),getTaskDetails)
router.put('/:taskid/title', authmiddleware, validateRequest({
  params: z.object({ taskid: z.string() }),
  body: z.object({ title: z.string() })
}), updateTasktitle);

router.put('/:taskid/description', authmiddleware, validateRequest({
  params: z.object({ taskid: z.string() }),
  body: z.object({ description: z.string() })
}), updateTaskDescription);
router.put('/:taskid/status', authmiddleware, validateRequest({
    params: z.object({ taskid: z.string() }),
    body: z.object({ status: z.enum(["To Do", "In Progress", "Done"]) }),
  }), updateTaskStatus);
export default router;