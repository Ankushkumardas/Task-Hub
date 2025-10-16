import User from "../models/user.js";
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
    const {name,email,password}=req.body;
  try {
  const existing=await User.find({email});
  if(existing && existing.length > 0){
    res.status(400).json({message:"User with this email already exists",success:false});
    return;
  }
    const hash=await bcrypt.hash(password,12);
    const saveuser=await User.create({email,password:hash,name
    })
    //todo sent email
    res.status(200).json({message:"OK verification mail sent to given email",success:true,data:saveuser})
} catch (error) {
    res.status(500).json({message:"ERROR",success:false,error:error.message})
  }
};


export const login = async (req, res) => {
  try {
    res.status(200).json({message:"OK",success:true})
} catch (error) {
    res.status(500).json({message:"ERROR",success:false,error:error.message})
  }
};

