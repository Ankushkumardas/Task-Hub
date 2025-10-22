import express from "express";
import { validateRequest } from "zod-express-middleware";
import { workspaceSchema } from "../libs/validateschema.js";
import { authmiddleware } from "../middlewares/authmiddleware.js";
import { createWorkspace, getWorkspaces } from "../controllers/workspaceController.js";
 const router=express.Router();

 router.post("/",authmiddleware,validateRequest({body:workspaceSchema}),createWorkspace);

 router.get("/",authmiddleware,getWorkspaces)

 export default router;