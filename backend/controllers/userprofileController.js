import User from "../models/user.js"
import bcrypt from 'bcryptjs';

export const getUserProfile = async (req, res) => {
    try {
        const user=await User.findById(req.user._id).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        delete user.password;
        res.status(200).json({message:"User profile fetched successfully",user});
    } catch (error) {
        res.status(500).json({message:"Error fetching user profile",error});
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.name = name || user.name;
        user.email = email || user.email;
        await user.save();
        res.status(200).json({ message: "User profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating user profile", error });
    }       
};

export const changepassword = async (req, res) => {
    try {
        // frontend sends { currentpassword, newpassword }
        const { currentpassword, newpassword } = req.body;
        if (!currentpassword || !newpassword) {
            return res.status(400).json({ message: 'Missing password fields' });
        }
        const user = await User.findById(req.user._id).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(currentpassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }
        const hashedPassword = await bcrypt.hash(newpassword, 12);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error('changepassword error', error);
        res.status(500).json({ message: "Error changing password", error });
    }   
};