import Workspace from '../models/workspace.js'
export const createWorkspace=async(req,res)=>{
    try {
        const {name,description,color}=req.body;
        const workspace=await Workspace.create({
            name,description,color,owner:req.user._id,members:[{
                user:req.user._id,role:"owner",joinedAt:new Date()
            }],
        });
        res.status(200).json({ message: "Workspace created  successfully",workspace });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internel server error" });
    }
};

export const getWorkspaces=async(req,res)=>{
    try {
      const worskspaces=await Workspace.find({"members.user":[req.user._id]}).sort({createdAt:-1});
      res.status(200).json({message:"Workspaces",worskspaces})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internel server error"})
    }
}