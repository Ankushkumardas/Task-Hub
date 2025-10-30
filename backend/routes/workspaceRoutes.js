import express from "express";
import { validateRequest } from "zod-express-middleware";
import { workspaceSchema } from "../libs/validateschema.js";
import { authmiddleware } from "../middlewares/authmiddleware.js";
import { createWorkspace, getArchievedProjects, getWorkspace, getWorkspaceProjects, getWorkspaces, getWorkspaceStats, workspaceMembers } from "../controllers/workspaceController.js";
 const router=express.Router();

 router.post("/",authmiddleware,validateRequest({body:workspaceSchema}),createWorkspace);

 router.get("/",authmiddleware,getWorkspaces)
 router.get("/:workspaceid",authmiddleware,getWorkspace)
 router.get("/:workspaceid/projects",authmiddleware,getWorkspaceProjects)
 router.get('/:workspaceid/members',authmiddleware,workspaceMembers)
 router.get("/:workspaceid/archieve",authmiddleware,getArchievedProjects)
 router.get("/:workspaceid/stats",authmiddleware,getWorkspaceStats)
  export default router;