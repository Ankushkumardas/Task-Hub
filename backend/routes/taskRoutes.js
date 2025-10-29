import express from 'express';
import { addComments, addSubtaskToTask, createTask, getActivity, getComments, getTaskDetails, updatesubtask, updateTaskAssignee, updateTaskDescription, updateTaskPriority, updateTaskStatus, updateTasktitle } from '../controllers/taskcontoller.js';
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
  router.put('/:taskid/assignees', authmiddleware, validateRequest({
    params: z.object({ taskid: z.string() }),
    body: z.object({ assignees: z.array(z.string()) })
  }), updateTaskAssignee);

  router.put('/:taskid/priority', authmiddleware, validateRequest({
    params: z.object({ taskid: z.string() }),
    body: z.object({ priority: z.enum(["Low", "Medium", "High"]) })
  }), updateTaskPriority);

  router.post('/:taskid/add-subtask', authmiddleware, validateRequest({
    params: z.object({ taskid: z.string() }),
    body: z.object({ title: z.string() })
  }), addSubtaskToTask);

  router.put('/:taskid/update-subtask/:subtaskid', authmiddleware, validateRequest({
    params: z.object({ taskid: z.string(), subtaskid: z.string() }),
    body: z.object({ title: z.string(), completed: z.boolean() })
  }), updatesubtask);

  router.get('/:resourceid/activity',authmiddleware,validateRequest({
    params:z.object({resourceid:z.string()}),
  }),getActivity)

  router.get('/:taskid/comments',authmiddleware,validateRequest({params:z.object({taskid:z.string()})}),getComments)

    router.post('/:taskid/add-comment', authmiddleware, validateRequest({
      params: z.object({ taskid: z.string() }),
      body: z.object({ text: z.string() })
    }),addComments);
export default router;