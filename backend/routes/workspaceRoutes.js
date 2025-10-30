import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { workspaceSchema } from "../libs/validateschema.js";
import { authmiddleware } from "../middlewares/authmiddleware.js";
import { acceptInviteToken, acceptWorkspaceInvite, createWorkspace, getArchievedProjects, getWorkspace, getWorkspaceProjects, getWorkspaces, getWorkspaceStats, inviteMembersToWorkspace, workspaceMembers } from "../controllers/workspaceController.js";
 const router=express.Router();

 router.post("/",authmiddleware,validateRequest({body:workspaceSchema}),createWorkspace);

 router.get("/",authmiddleware,getWorkspaces)
 router.get("/:workspaceid",authmiddleware,getWorkspace)
 router.get("/:workspaceid/projects",authmiddleware,getWorkspaceProjects)
 router.get('/:workspaceid/members',authmiddleware,workspaceMembers)
 router.get("/:workspaceid/archieve",authmiddleware,getArchievedProjects)
 router.get("/:workspaceid/stats",authmiddleware,getWorkspaceStats)

 //settings route can be added later
 router.post("/accept-invite-token",authmiddleware,validateRequest({body:z.object({token:z.string()})}),acceptInviteToken);

 router.post("/:workspaceid/invite-members",authmiddleware,validateRequest({params:z.object({workspaceid:z.string()}),body:z.object({email:z.string().email(),role:z.string()})}),inviteMembersToWorkspace);

 router.post("/:workspaceid/accept-generate-invite",authmiddleware,validateRequest({params:z.object({workspaceid:z.string()})}),acceptWorkspaceInvite);
 export default router;